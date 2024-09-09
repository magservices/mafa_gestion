<?php

namespace App\Controller;

use App\Entity\Payement;
use App\Entity\Eleve;
use App\Repository\PayementRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/payement')]
class PayementController extends AbstractController
{
    private $entityManager;
    private $payementRepository;

    public function __construct(EntityManagerInterface $entityManager, PayementRepository $payementRepository)
    {
        $this->entityManager = $entityManager;
        $this->payementRepository = $payementRepository;
    }

    // Create a new Payement
    #[Route('', name: 'create_payement', methods: ['POST'])]
    public function createPayement(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $eleveId = $data['eleve_id'];

        $eleve = $this->entityManager->getRepository(Eleve::class)->find($eleveId);
        if (!$eleve) {
            return new JsonResponse(['status' => 'Eleve not found!'], Response::HTTP_NOT_FOUND);
        }

        $payement = new Payement();
        $payement->setAnneeScolaire($data['anneeScolaire']);
        $payement->setFretIncription($data['fretIncription']);
        $payement->setFretTotal($data['fretTotal']);
        $payement->setFretMois($data['fretMois']);
        $payement->setStatus($data['status']);
        $payement->setEleve($eleve);

        $this->entityManager->persist($payement);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Payement created!'], Response::HTTP_CREATED);
    }

    // Update an existing Payement
    #[Route('/{id}', name: 'update_payement', methods: ['POST'])]
    public function updatePayement(Request $request, int $id): JsonResponse
    {
        $payement = $this->payementRepository->find($id);

        if (!$payement) {
            return new JsonResponse(['status' => 'Payement not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $payement->setAnneeScolaire($data['anneeScolaire'] ?? $payement->getAnneeScolaire());
        $payement->setFretIncription($data['fretIncription'] ?? $payement->getFretIncription());
        $payement->setFretTotal($data['fretTotal'] ?? $payement->getFretTotal());
        $payement->setFretMois($data['fretMois'] ?? $payement->getFretMois());
        $payement->setStatus($data['status'] ?? $payement->getStatus());

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Payement updated!'], Response::HTTP_OK);
    }

    // Delete a Payement
    #[Route('/{id}', name: 'delete_payement', methods: ['DELETE'])]
    public function deletePayement(int $id): JsonResponse
    {
        $payement = $this->payementRepository->find($id);

        if (!$payement) {
            return new JsonResponse(['status' => 'Payement not found!'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($payement);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Payement deleted!'], Response::HTTP_OK);
    }

    // Get a Payement by ID
    #[Route('/{id}', name: 'get_payement', methods: ['GET'])]
    public function getPayement(int $id): JsonResponse
    {
        $payement = $this->payementRepository->find($id);

        if (!$payement) {
            return new JsonResponse(['status' => 'Payement not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $payement->getId(),
            'anneeScolaire' => $payement->getAnneeScolaire()->format('Y-m-d'),
            'fretIncription' => $payement->getFretIncription(),
            'fretTotal' => $payement->getFretTotal(),
            'fretMois' => $payement->getFretMois(),
            'status' => $payement->getStatus(),
            'eleve_id' => $payement->getEleve()->getId(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
