<?php

namespace App\Controller;

use App\Entity\Eleve;
use App\Entity\StudentPayment;
use App\Repository\EleveRepository;
use App\Repository\StudentPaymentRepository;
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

    public function __construct(EntityManagerInterface $entityManager, StudentPaymentRepository $repository)
    {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
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
                'amount' => $payment->getAmount(),
                'month' => $payment->getMonth(),
                'registerStudentId' => $payment->getRegisterStudent()?->getId(),
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

        return $this->json($payment);
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
        $payment->setMonth($data['month']);

        // Lier le paiement à l'élève
        $payment->setRegisterStudent($eleve);

        // Sauvegarder le paiement dans la base de données
        $this->entityManager->persist($payment);
        $this->entityManager->flush();

        // Retourner une réponse simplifiée sans sérialisation des entités liées
        return new JsonResponse([
            'id' => $payment->getId(),
            'totalAnnualCosts' => $payment->getTotalAnnualCosts(),
            'paymentReason' => $payment->getPaymentReason(),
            'paymentStatus' => $payment->getPaymentStatus(),
            'amount' => $payment->getAmount(),
            'month' => $payment->getMonth(),
            'register_student_id' => $payment->getRegisterStudent()->getId() // ID de l'élève lié
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
