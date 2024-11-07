<?php

namespace App\Controller;

use App\Entity\Eleve;
use App\Entity\StudentPayment;
use App\Repository\EleveRepository;
use App\Repository\StudentPaymentRepository;
use App\Service\WebhookService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/student_payment')]
class StudentPaymentController extends AbstractController
{
    private $entityManager;
    private $repository;

    private $webhookService;

    public function __construct(EntityManagerInterface   $entityManager,
                                StudentPaymentRepository $repository,
                                WebhookService           $webhookService)
    {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->webhookService = $webhookService;
    }

    #[Route('', name: 'student_payment_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $payments = $this->repository->findAll();

        // Transformer les paiements en tableaux simples
        $data = [];
        foreach ($payments as $payment) {
            $data[] = [
                'id' => $payment->getId(),
                'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                'paymentReason' => $payment->getPaymentReason(),
                'paymentStatus' => $payment->getPaymentStatus(),
                'fees' => $payment->isFees(),
                'amount' => $payment->getAmount(),
                'month' => $payment->getMonth(),
                'month_total' => $payment->getMonthTotal(),
                'create_at' => $payment->getCreateAt()->format('Y-m-d H:i:s'), // Retourner la date dans un format lisible
                'register_student_id' => $payment->getRegisterStudent()->getId(),
                'establishment' => $payment->getEstablishment() // Ajouter l'établissement au retour
            ];
        }

        return $this->json($data);
    }

    #[Route('/establishment/{establishment}', name: 'student_payment_by_establishment', methods: ['GET'])]
    public function getPaymentsByEstablishment(string $establishment): JsonResponse
    {
        // Rechercher les paiements filtrés par l'établissement
        $payments = $this->repository->findBy(['establishment' => $establishment]);

        // Transformer les paiements en tableaux simples
        $data = [];
        foreach ($payments as $payment) {
            $data[] = [
                'id' => $payment->getId(),
                'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
                'paymentReason' => $payment->getPaymentReason(),
                'paymentStatus' => $payment->getPaymentStatus(),
                'fees' => $payment->isFees(),
                'amount' => $payment->getAmount(),
                'month' => $payment->getMonth(),
                'month_total' => $payment->getMonthTotal(),
                'create_at' => $payment->getCreateAt()->format('Y-m-d H:i:s'), // Retourner la date dans un format lisible
                'register_student_id' => $payment->getRegisterStudent()->getId(),
                'establishment' => $payment->getEstablishment() // Ajouter l'établissement au retour
            ];
        }

        return $this->json($data);
    }


    #[Route('/{id}', name: 'student_payment_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $payment = $this->repository->find($id);

        if (!$payment) {
            return $this->json(['message' => 'Payment not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id' => $payment->getId(),
            'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
            'paymentReason' => $payment->getPaymentReason(),
            'paymentStatus' => $payment->getPaymentStatus(),
            'fees' => $payment->isFees(),
            'amount' => $payment->getAmount(),
            'month' => $payment->getMonth(),
            'month_total' => $payment->getMonthTotal(),
            'create_at' => $payment->getCreateAt()->format('Y-m-d H:i:s'), // Retourner la date dans un format lisible
            'register_student_id' => $payment->getRegisterStudent()->getId(), // ID de l'élève lié
            'establishment' => $payment->getEstablishment() // Ajouter l'établissement au retour

        ], Response::HTTP_CREATED);
    }

    #[Route('/create', name: 'student_payment_create', methods: ['POST'])]
    public function create(Request $request, EleveRepository $eleveRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier si 'register_student_id' est défini
        if (!isset($data['register_student_id'])) {
            return new JsonResponse(['error' => 'register_student_id is missing'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'élève en fonction de l'ID envoyé dans le JSON
        $eleve = $eleveRepository->find($data['register_student_id']);

        // Vérifier si l'élève existe
        if (!$eleve) {
            return new JsonResponse(['error' => 'Student not found!'], Response::HTTP_NOT_FOUND);
        }

        // Créer le paiement
        $payment = new StudentPayment();
        $payment->setTotalAnnualCosts($data['totalAnnualCosts']);
        $payment->setPaymentReason($data['paymentReason']);
        $payment->setPaymentStatus($data['paymentStatus']);
        $payment->setAmount($data['amount']);
        $payment->setFees($data['fees']);
        $payment->setMonth($data['month']);
        $payment->setMonthTotal($data['month_total']);
        $payment->setEstablishment($data['establishment']);

        // Gérer le champ 'create_at'
        if (isset($data['create_at'])) {
            try {
                // Convertir en DateTimeImmutable
                $createAt = new \DateTimeImmutable($data['create_at']);
                $payment->setCreateAt($createAt);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Invalid date format for create_at'], Response::HTTP_BAD_REQUEST);
            }
        } else {
            // Si create_at n'est pas fourni, définir la date actuelle
            $payment->setCreateAt(new \DateTimeImmutable());
        }

        // Lier le paiement à l'élève
        $payment->setRegisterStudent($eleve);

        // Sauvegarder le paiement dans la base de données
        $this->entityManager->persist($payment);
        $this->entityManager->flush();

        // Envoyer une notification via webhook
        $this->webhookService->sendWebhookNotification('https://socket.magservices-mali.org/api/webhook/notify', [
            'message' => "Paiement mensuel de l'élève : " . $eleve->getPrenom() . ' ' . $eleve->getNom(),
            'data' => $data,
            'establishmentId' => $eleve->getEstablishment()
        ]);

        // Retourner une réponse simplifiée sans sérialisation des entités liées
        return new JsonResponse([
            'id' => $payment->getId(),
            'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
            'paymentReason' => $payment->getPaymentReason(),
            'paymentStatus' => $payment->getPaymentStatus(),
            'fees' => $payment->isFees(),
            'amount' => $payment->getAmount(),
            'month' => $payment->getMonth(),
            'month_total' => $payment->getMonthTotal(),
            'create_at' => $payment->getCreateAt()->format('Y-m-d H:i:s'), // Retourner la date dans un format lisible
            'register_student_id' => $payment->getRegisterStudent()->getId(), // ID de l'élève lié
            'establishment' => $payment->getEstablishment() // Ajouter l'établissement au retour

        ], Response::HTTP_CREATED);
    }


    #[Route('/{id}', name: 'student_payment_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $payment = $this->repository->find($id);

        if (!$payment) {
            return $this->json(['message' => 'Payment not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $payment->setTotalAnnualCosts($data['totalAnnualCosts'] ?? $payment->getTotalAnnualCosts());
        $payment->setPaymentReason($data['paymentReason'] ?? $payment->getPaymentReason());
        $payment->setPaymentStatus($data['paymentStatus'] ?? $payment->getPaymentStatus());
        $payment->setAmount($data['amount'] ?? $payment->getAmount());
        $payment->setMonth($data['month'] ?? $payment->getMonth());
        $payment->setMonthTotal($data['month_total'] ?? $payment->getMonthTotal());
        $payment->setFees($data['fees'] ?? $payment->isFees());
        $payment->setCreateAt($data['create_at'] ?? $payment->getCreateAt());

        $this->entityManager->flush();

        return $this->json($payment);
    }

    #[Route('/{id}', name: 'student_payment_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $payment = $this->repository->find($id);

        if (!$payment) {
            return $this->json(['message' => 'Payment not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($payment);
        $this->entityManager->flush();

        return $this->json(['message' => 'Payment deleted']);
    }
}
