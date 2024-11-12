<?php

namespace App\Controller;

use App\Entity\Eleve;
use App\Service\WebhookService;
use App\Repository\EleveRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
#[Route('/api/eleve')]
class EleveController extends AbstractController
{
    private $entityManager;
    private $eleveRepository;

    private $webhookService;

    public function __construct(EntityManagerInterface $entityManager,
                                EleveRepository        $eleveRepository,
                                WebhookService         $webhookService)
    {
        $this->entityManager = $entityManager;
        $this->eleveRepository = $eleveRepository;
        $this->webhookService = $webhookService;
    }


    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/create', name: 'create_student', methods: ['POST'])]
    public function createEleve(Request $request, #[Autowire('%photo_dir%')] string $photoDir): JsonResponse
    {
        $data = json_decode($request->request->get('eleveData'), true);

        $eleve = new Eleve();
        $eleve->setNom($data['nom']);
        $eleve->setPrenom($data['prenom']);
        try {
            $eleve->setDateNaissance(new \DateTime($data['dateNaissance']));
        } catch (\Exception $e) {
            // Si la date est invalide ou incorrecte, on la met à 1er janvier 1900
            $eleve->setDateNaissance(new \DateTime('1900-01-01'));
        }
        $eleve->setNiveau($data['niveau']);
        $eleve->setClasse($data['classe']);
      //  $eleve->setPrive($data['prive']);
        $eleve->setTransfere($data['transfere']);
        $eleve->setMatricule($data['matricule']);
        $eleve->setPrenomPere($data['prenomPere']);
        $eleve->setNomPere($data['nomPere']);
        $eleve->setPrenomMere($data['prenomMere']);
        $eleve->setStudentID($data['studentID']);
        $eleve->setNomMere($data['nomMere']);
        $eleve->setTel1($data['tel1']);
        $eleve->setTel2($data['tel2']);
        $eleve->setEstablishment($data['establishment']);
        $eleve->setUserkey($data['userKey']);

        $file = $request->files->get('photo');
        if ($file) {
            $photoName = uniqid() . '.' . $file->guessExtension();
            $file->move($photoDir, $photoName);

            // Stocker seulement le nom du fichier pour accéder via URL
            $eleve->setPhotoPath('https://mafa.magservices-mali.org/public/uploads/' . $photoName);
            $eleve->setPhotoName($photoName);
        }

        $this->entityManager->persist($eleve);
        $this->entityManager->flush();

        // Préparer les données de l'élève
        $data = [
            'id' => $eleve->getId(),
            'nom' => $eleve->getNom(),
            'prenom' => $eleve->getPrenom(),
            'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
            'niveau' => $eleve->getNiveau(),
            'classe' => $eleve->getClasse(),
           // 'prive' => $eleve->isPrive(),
            'transfere' => $eleve->getTransfere(),
            'matricule' => $eleve->getMatricule(),
            'prenomPere' => $eleve->getPrenomPere(),
            'nomPere' => $eleve->getNomPere(),
            'prenomMere' => $eleve->getPrenomMere(),
            'nomMere' => $eleve->getNomMere(),
            'tel1' => $eleve->getTel1(),
            'tel2' => $eleve->getTel2(),
            'photoPath' => $eleve->getPhotoPath(),
            'photoName' => $eleve->getPhotoName(),
            'studentID' => $eleve->getStudentID(),
            'establishment' => $eleve->getEstablishment(),
            'userKey' => $eleve->getUserkey(),
            'registerPaymentStudent' => [],
        ];

        // Envoyer une notification via webhook
        $this->webhookService->sendWebhookNotification('https://socket.magservices-mali.org/api/webhook/notify', [
            'message' => "Inscription d'un nouveau élève " . $eleve->getPrenom() . ' ' . $eleve->getNom(),
            'data' => $data,
            'establishmentId' => $eleve->getEstablishment()
        ]);

        return new JsonResponse($data, Response::HTTP_OK);

    }


    // Update an existing Eleve

    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/{id}', name: 'update_eleve', methods: ['POST'])]
    public function updateEleve(Request $request, int $id, #[Autowire('%photo_dir%')] string $photoDir): JsonResponse
    {
        $eleve = $this->eleveRepository->find($id);

        if (!$eleve) {
            return new JsonResponse(['status' => 'Eleve not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->request->get('eleveData'), true);

        $eleve->setNom($data['nom'] ?? $eleve->getNom());
        $eleve->setPrenom($data['prenom'] ?? $eleve->getPrenom());

       // $eleve->setDateNaissance(isset($data['dateNaissance']) ? new \DateTime($data['dateNaissance']) : $eleve->getDateNaissance());
         try {
            $eleve->setDateNaissance(new \DateTime($data['dateNaissance']));
        } catch (\Exception $e) {
            // Si la date est invalide ou incorrecte, on la met à 1er janvier 1900
            $eleve->setDateNaissance(new \DateTime('1900-01-01'));
        }
        
        $eleve->setNiveau($data['niveau'] ?? $eleve->getNiveau());
        $eleve->setClasse($data['classe'] ?? $eleve->getClasse());
       // $eleve->setPrive($data['prive'] ?? $eleve->isPrive());
        $eleve->setTransfere($data['transfere'] ?? $eleve->getTransfere());
        $eleve->setMatricule($data['matricule'] ?? $eleve->getMatricule());
        $eleve->setPrenomPere($data['prenomPere'] ?? $eleve->getPrenomPere());
        $eleve->setNomPere($data['nomPere'] ?? $eleve->getNomPere());
        $eleve->setPrenomMere($data['prenomMere'] ?? $eleve->getPrenomMere());
        $eleve->setNomMere($data['nomMere'] ?? $eleve->getNomMere());
        $eleve->setTel1($data['tel1'] ?? $eleve->getTel1());
        $eleve->setTel2($data['tel2'] ?? $eleve->getTel2());


        $file = $request->files->get('photo');
        if ($file) {
            if ($eleve->getPhotoPath()) {
                unlink($eleve->getPhotoPath());
            }

            $photoName = uniqid() . '.' . $file->guessExtension();
            $file->move($photoDir, $photoName);
            $eleve->setPhotoPath($photoDir . $photoName);
            $eleve->setPhotoName($photoName);
        }


        $this->entityManager->persist($eleve);
        $this->entityManager->flush();

        // Envoyer une notification via webhook
        $this->webhookService->sendWebhookNotification('https://mafa.magservices-mali.org/api/webhook/notify', [
            'message' => "Mise à jour élève " . $eleve->getPrenom() . ' ' . $eleve->getNom(),
            'data' => $eleve
        ]);

        return new JsonResponse(['status' => 'Eleve updated!'], Response::HTTP_OK);
    }


    #[Route('/{id}', name: 'delete_eleve', methods: ['DELETE'])]
    public function deleteEleve(int $id, #[Autowire('%photo_dir%')] string $photoDir): JsonResponse
    {
        $eleve = $this->eleveRepository->find($id);

        if (!$eleve) {
            return new JsonResponse(['status' => 'Eleve not found!'], Response::HTTP_NOT_FOUND);
        }


        if ($eleve->getPhotoPath()) {
            unlink($eleve->getPhotoPath());
        }

        $this->entityManager->remove($eleve);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Eleve deleted!'], Response::HTTP_OK);
    }


    #[Route('/{id}', name: 'get_eleve', methods: ['GET'])]
    public function getEleve(int $id): JsonResponse
    {
        $eleve = $this->eleveRepository->find($id);

        if (!$eleve) {
            return new JsonResponse(['status' => 'Eleve not found!'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les paiements et les trier par ID en ordre décroissant
        $payments = $eleve->getRegisterPaymentStudent()->toArray();
        usort($payments, function ($a, $b) {
            return $b->getId() <=> $a->getId(); // Tri décroissant par ID
        });

        $paymentsData = [];
        foreach ($payments as $payment) {
            $paymentsData[] = [
                'id' => $payment->getId(),
                'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                'paymentReason' => $payment->getPaymentReason(),
                'paymentStatus' => $payment->getPaymentStatus(),
                'amount' => $payment->getAmount(),
                'month' => $payment->getMonth(),
                'month_total' => $payment->getMonthTotal(),
                'create_at' => $payment->getCreateAt()->format('Y-m-d H:i:s'), // Retourner la date dans un format lisible
                'register_student_id' => $payment->getRegisterStudent()->getId() // ID de l'élève lié
            ];
        }

        $data = [
            'id' => $eleve->getId(),
            'nom' => $eleve->getNom(),
            'prenom' => $eleve->getPrenom(),
            'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
            'niveau' => $eleve->getNiveau(),
            'classe' => $eleve->getClasse(),
          //  'prive' => $eleve->isPrive(),
            'transfere' => $eleve->getTransfere(),
            'matricule' => $eleve->getMatricule(),
            'prenomPere' => $eleve->getPrenomPere(),
            'nomPere' => $eleve->getNomPere(),
            'prenomMere' => $eleve->getPrenomMere(),
            'nomMere' => $eleve->getNomMere(),
            'tel1' => $eleve->getTel1(),
            'tel2' => $eleve->getTel2(),
            'photoPath' => $eleve->getPhotoPath(),
            'photoName' => $eleve->getPhotoName(),
            'studentID' => $eleve->getStudentID(),
            'userKey' => $eleve->getUserkey(),
            'registerPaymentStudent' => $paymentsData,
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }


    #[Route('/', name: 'get_all_eleves', methods: ['GET'])]
    public function getAllEleves(): JsonResponse
    {
        // Récupérer tous les élèves triés par ID de manière décroissante
        $eleves = $this->eleveRepository->findBy([], ['id' => 'DESC']);

        if (!$eleves) {
            return new JsonResponse(['status' => 'No students found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [];
        foreach ($eleves as $eleve) {
            // Récupérer les paiements pour chaque élève
            $payments = $eleve->getRegisterPaymentStudent()->toArray();
            usort($payments, function ($a, $b) {
                return $b->getId() <=> $a->getId(); // Tri décroissant par ID
            });

            // Préparer les données de paiement
            $paymentsData = [];
            foreach ($payments as $payment) {
                $paymentsData[] = [
                    'id' => $payment->getId(),
                    'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                    'paymentReason' => $payment->getPaymentReason(),
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'amount' => $payment->getAmount(),
                    'month' => $payment->getMonth(),
                    'month_total' => $payment->getMonthTotal(),
                ];
            }

            // Préparer les données de l'élève
            $data[] = [
                'id' => $eleve->getId(),
                'nom' => $eleve->getNom(),
                'prenom' => $eleve->getPrenom(),
                'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
                'niveau' => $eleve->getNiveau(),
                'classe' => $eleve->getClasse(),
              //  'prive' => $eleve->isPrive(),
                'transfere' => $eleve->getTransfere(),
                'matricule' => $eleve->getMatricule(),
                'prenomPere' => $eleve->getPrenomPere(),
                'nomPere' => $eleve->getNomPere(),
                'prenomMere' => $eleve->getPrenomMere(),
                'nomMere' => $eleve->getNomMere(),
                'tel1' => $eleve->getTel1(),
                'tel2' => $eleve->getTel2(),
                'photoPath' => $eleve->getPhotoPath(),
                'photoName' => $eleve->getPhotoName(),
                'studentID' => $eleve->getStudentID(),
                'establishment' => $eleve->getEstablishment(),
                'userKey' => $eleve->getUserkey(),
                'registerPaymentStudent' => $paymentsData,
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/establishment/{establishment}', name: 'get_establishment_all_student', methods: ['GET'])]
    public function getEstablishmentAllStudent(string $establishment): JsonResponse
    {
        // Si un établissement est fourni, filtrer les élèves par cet établissement
        if ($establishment) {
            $eleves = $this->eleveRepository->findBy(['establishment' => $establishment], ['id' => 'DESC']);
        } else {
            // Sinon, récupérer tous les élèves triés par ID de manière décroissante
            $eleves = $this->eleveRepository->findBy([], ['id' => 'DESC']);
        }

        if (!$eleves) {
            return new JsonResponse(['status' => 'No students found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [];
        foreach ($eleves as $eleve) {
            // Récupérer les paiements pour chaque élève
            $payments = $eleve->getRegisterPaymentStudent()->toArray();
            usort($payments, function ($a, $b) {
                return $b->getId() <=> $a->getId(); // Tri décroissant par ID
            });

            // Préparer les données de paiement
            $paymentsData = [];
            foreach ($payments as $payment) {
                $paymentsData[] = [
                    'id' => $payment->getId(),
                    'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                    'paymentReason' => $payment->getPaymentReason(),
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'amount' => $payment->getAmount(),
                    'month' => $payment->getMonth(),
                    'month_total' => $payment->getMonthTotal(),
                ];
            }

            // Préparer les données de l'élève
            $data[] = [
                'id' => $eleve->getId(),
                'nom' => $eleve->getNom(),
                'prenom' => $eleve->getPrenom(),
                'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
                'niveau' => $eleve->getNiveau(),
                'classe' => $eleve->getClasse(),
               // 'prive' => $eleve->isPrive(),
                'transfere' => $eleve->getTransfere(),
                'matricule' => $eleve->getMatricule(),
                'prenomPere' => $eleve->getPrenomPere(),
                'nomPere' => $eleve->getNomPere(),
                'prenomMere' => $eleve->getPrenomMere(),
                'nomMere' => $eleve->getNomMere(),
                'tel1' => $eleve->getTel1(),
                'tel2' => $eleve->getTel2(),
                'photoPath' => $eleve->getPhotoPath(),
                'photoName' => $eleve->getPhotoName(),
                'studentID' => $eleve->getStudentID(),
                'establishment' => $eleve->getEstablishment(),
                'userKey' => $eleve->getUserkey(),
                'registerPaymentStudent' => $paymentsData,
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }


    #[Route('/establishment', name: 'get_establishment_student_by_key', methods: ['GET'])]
    public function getEstablishmentStudentByKey(
        Request $request
    ): JsonResponse {
        // Récupérer les paramètres de la requête
        $establishment = $request->query->get('establishment');
        $userKey = $request->query->get('userKey');

        // Initialiser la condition de recherche
        $criteria = [];

        // Si un établissement est fourni, ajouter au critère
        if ($establishment) {
            $criteria['establishment'] = $establishment;
        }

        // Si une userKey est fournie, ajouter au critère
        if ($userKey) {
            $criteria['userKey'] = $userKey;
        }

        // Récupérer les élèves en fonction des critères
        $eleves = $this->eleveRepository->findBy($criteria, ['id' => 'DESC']);

        // Vérifier si des élèves ont été trouvés
        if (!$eleves) {
            return new JsonResponse(['status' => 'No students found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [];
        foreach ($eleves as $eleve) {
            // Récupérer les paiements pour chaque élève
            $payments = $eleve->getRegisterPaymentStudent()->toArray();
            usort($payments, function ($a, $b) {
                return $b->getId() <=> $a->getId(); // Tri décroissant par ID
            });

            // Préparer les données de paiement
            $paymentsData = [];
            foreach ($payments as $payment) {
                $paymentsData[] = [
                    'id' => $payment->getId(),
                    'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                    'paymentReason' => $payment->getPaymentReason(),
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'amount' => $payment->getAmount(),
                    'month' => $payment->getMonth(),
                    'month_total' => $payment->getMonthTotal(),
                ];
            }

            // Préparer les données de l'élève
            $data[] = [
                'id' => $eleve->getId(),
                'nom' => $eleve->getNom(),
                'prenom' => $eleve->getPrenom(),
                'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
                'niveau' => $eleve->getNiveau(),
                'classe' => $eleve->getClasse(),
               // 'prive' => $eleve->isPrive(),
                'transfere' => $eleve->getTransfere(),
                'matricule' => $eleve->getMatricule(),
                'prenomPere' => $eleve->getPrenomPere(),
                'nomPere' => $eleve->getNomPere(),
                'prenomMere' => $eleve->getPrenomMere(),
                'nomMere' => $eleve->getNomMere(),
                'tel1' => $eleve->getTel1(),
                'tel2' => $eleve->getTel2(),
                'photoPath' => $eleve->getPhotoPath(),
                'photoName' => $eleve->getPhotoName(),
                'studentID' => $eleve->getStudentID(),
                'establishment' => $eleve->getEstablishment(),
                'registerPaymentStudent' => $paymentsData,
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }


  
}