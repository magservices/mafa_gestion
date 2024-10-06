<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Establishment;
use App\Repository\EstablishmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/establishment')]
class EstablishmentController extends AbstractController
{
    #[Route('', name: 'establishment_get_all', methods: ['GET'])]
    public function getAll(EstablishmentRepository $repository): JsonResponse
    {
        $establishments = $repository->findBy([], ['id' => 'DESC']);
        return $this->json($establishments, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'establishment_get', methods: ['GET'])]
    public function get(Establishment $establishment): JsonResponse
    {
        return $this->json($establishment, Response::HTTP_OK);
    }

    #[Route('/name/{name}', name: 'establishment_get_by_name', methods: ['GET'])]
    public function getByName(string $name, EstablishmentRepository $establishmentRepository): JsonResponse
    {
        // Recherche de l'établissement par son nom
        $establishment = $establishmentRepository->findOneBy(['name' => $name]);

        // Si l'établissement n'existe pas, renvoyer une réponse 404
        if (!$establishment) {
            return $this->json(['message' => 'Etablissement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Retourne les données de l'établissement trouvé
        return $this->json($establishment, Response::HTTP_OK);
    }

    #[Route('/new', name: 'establishment_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification si les données existent
        if (!$data) {
            return $this->json(['error' => 'Invalid or missing data'], Response::HTTP_BAD_REQUEST);
        }

        $establishment = new Establishment();
        $establishment->setName($data['name']);
        $establishment->setAddress($data['address']);
        $establishment->setPhone($data['phone']);
        $establishment->setSubscriptionType($data['subscriptionType']);
        $establishment->setModalType($data['modalType']);
        $establishment->setPrice($data['price']);
        $establishment->setMonth($data['month']);
        $establishment->setCreateAt(new \DateTimeImmutable());
        $establishment->setExpiryDate(new \DateTimeImmutable($data['expiryDate']));

        // Validation des données
        $errors = $validator->validate($establishment);
        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($establishment);
        $entityManager->flush();

        return $this->json($establishment, Response::HTTP_CREATED);
    }

    #[Route('/{id}/edit', name: 'establishment_update', methods: ['PUT'])]
    public function update(
        Request $request,
        Establishment $establishment,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid or missing data'], Response::HTTP_BAD_REQUEST);
        }

        // Mise à jour des champs
        $establishment->setName($data['name']);
        $establishment->setAddress($data['address']);
        $establishment->setPhone($data['phone']);
        $establishment->setSubscriptionType($data['subscriptionType']);
        $establishment->setModalType($data['modalType']);
        $establishment->setPrice($data['price']);
        $establishment->setMonth($data['month']);
        $establishment->setExpiryDate(new \DateTimeImmutable($data['expiryDate']));

        // Validation des données mises à jour
        $errors = $validator->validate($establishment);
        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $entityManager->flush();

        return $this->json($establishment, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'establishment_delete', methods: ['DELETE'])]
    public function delete(
        Establishment $establishment,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entityManager->remove($establishment);
        $entityManager->flush();

        return $this->json(['message' => 'Establishment deleted successfully'], Response::HTTP_OK);
    }
}
