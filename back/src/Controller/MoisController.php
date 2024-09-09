<?php

namespace App\Controller;

use App\Entity\Mois;
use App\Entity\Payement;
use App\Repository\MoisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/mois')]
class MoisController extends AbstractController
{
    private $entityManager;
    private $moisRepository;

    public function __construct(EntityManagerInterface $entityManager, MoisRepository $moisRepository)
    {
        $this->entityManager = $entityManager;
        $this->moisRepository = $moisRepository;
    }

    // Create a new Mois
    #[Route('', name: 'create_mois', methods: ['POST'])]
    public function createMois(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $payementId = $data['payement_id'];

       
        $payement = $this->entityManager->getRepository(Payement::class)->find($payementId);
        if (!$payement) {
            return new JsonResponse(['status' => 'Payement not found!'], Response::HTTP_NOT_FOUND);
        }

        $mois = new Mois();
        $mois->setMois($data['mois']);
        $mois->setMontant($data['montant']);
        $mois->setPayement($payement);

        $this->entityManager->persist($mois);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Mois created!'], Response::HTTP_CREATED);
    }

    // Update an existing Mois
    #[Route('/{id}', name: 'update_mois', methods: ['POST'])]
    public function updateMois(Request $request, int $id): JsonResponse
    {
        $mois = $this->moisRepository->find($id);

        if (!$mois) {
            return new JsonResponse(['status' => 'Mois not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $mois->setMois($data['mois'] ?? $mois->getMois());
        $mois->setMontant($data['montant'] ?? $mois->getMontant());

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Mois updated!'], Response::HTTP_OK);
    }

    // Delete a Mois
    #[Route('/{id}', name: 'delete_mois', methods: ['DELETE'])]
    public function deleteMois(int $id): JsonResponse
    {
        $mois = $this->moisRepository->find($id);

        if (!$mois) {
            return new JsonResponse(['status' => 'Mois not found!'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($mois);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Mois deleted!'], Response::HTTP_OK);
    }

    // Get a Mois by ID
    #[Route('/{id}', name: 'get_mois', methods: ['GET'])]
    public function getMois(int $id): JsonResponse
    {
        $mois = $this->moisRepository->find($id);

        if (!$mois) {
            return new JsonResponse(['status' => 'Mois not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $mois->getId(),
            'mois' => $mois->getMois(),
            'montant' => $mois->getMontant(),
            'payement_id' => $mois->getPayement()->getId(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
