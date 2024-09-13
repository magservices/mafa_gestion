<?php

namespace App\Controller;

use App\Entity\Eleve;
use App\Repository\EleveRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[Route('/api/eleve')]
class EleveController extends AbstractController
{
    private $entityManager;
    private $eleveRepository;

    public function __construct(EntityManagerInterface $entityManager, EleveRepository $eleveRepository)
    {
        $this->entityManager = $entityManager;
        $this->eleveRepository = $eleveRepository;
    }


    #[Route('/create', name: 'create_student', methods: ['POST'])]
    public function createEleve(Request $request, #[Autowire('%photo_dir%')] string $photoDir): JsonResponse
    {
        $data = json_decode($request->request->get('eleveData'), true);

        $eleve = new Eleve();
        $eleve->setNom($data['id']);
        $eleve->setNom($data['nom']);
        $eleve->setPrenom($data['prenom']);
        $eleve->setDateNaissance(new \DateTime($data['dateNaissance']));
        $eleve->setNiveau($data['niveau']);
        $eleve->setClasse($data['classe']);
        $eleve->setPrive($data['prive']);
        $eleve->setTransfere($data['transfere']);
        $eleve->setMatricule($data['matricule']);
        $eleve->setPrenomPere($data['prenomPere']);
        $eleve->setNomPere($data['nomPere']);
        $eleve->setPrenomMere($data['prenomMere']);
        $eleve->setStudentID($data['studentID']);
        $eleve->setNomMere($data['nomMere']);
        $eleve->setTel1($data['tel1']);
        $eleve->setTel2($data['tel2']);

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
        $data[] = [
            'id' => $eleve->getId(),
            'nom' => $eleve->getNom(),
            'prenom' => $eleve->getPrenom(),
            'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
            'niveau' => $eleve->getNiveau(),
            'classe' => $eleve->getClasse(),
            'prive' => $eleve->isPrive(),
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
            'registerPaymentStudent' => [],
        ];

        return new JsonResponse($data, Response::HTTP_OK);

    }


// Update an existing Eleve
    #[
        Route('/{id}', name: 'update_eleve', methods: ['POST'])]
    public function updateEleve(Request $request, int $id, #[Autowire('%photo_dir%')] string $photoDir): JsonResponse
    {
        $eleve = $this->eleveRepository->find($id);

        if (!$eleve) {
            return new JsonResponse(['status' => 'Eleve not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->request->get('eleveData'), true);

        $eleve->setNom($data['nom'] ?? $eleve->getNom());
        $eleve->setPrenom($data['prenom'] ?? $eleve->getPrenom());
        $eleve->setDateNaissance(isset($data['dateNaissance']) ? new \DateTime($data['dateNaissance']) : $eleve->getDateNaissance());
        $eleve->setNiveau($data['niveau'] ?? $eleve->getNiveau());
        $eleve->setClasse($data['classe'] ?? $eleve->getClasse());
        $eleve->setPrive($data['prive'] ?? $eleve->isPrive());
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
            ];
        }

        $data = [
            'id' => $eleve->getId(),
            'nom' => $eleve->getNom(),
            'prenom' => $eleve->getPrenom(),
            'dateNaissance' => $eleve->getDateNaissance()->format('Y-m-d'),
            'niveau' => $eleve->getNiveau(),
            'classe' => $eleve->getClasse(),
            'prive' => $eleve->isPrive(),
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
                'prive' => $eleve->isPrive(),
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
                'registerPaymentStudent' => $paymentsData,
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }


}