<?php

namespace App\Controller;

use Random\RandomException;
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

    #[Route('/name/{accessKey}', name: 'establishment_get_by_key_access', methods: ['GET'])]
    public function getByName(string $accessKey, EstablishmentRepository $establishmentRepository): JsonResponse
    {
        // Recherche de l'établissement par son nom
        $establishment = $establishmentRepository->findOneBy(['accessKey' => $accessKey]);

        // Si l'établissement n'existe pas, renvoyer une réponse 404
        if (!$establishment) {
            return $this->json(['message' => 'Etablissement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Retourne les données de l'établissement trouvé
        return $this->json($establishment, Response::HTTP_OK);
    }

    /**
     * @throws RandomException
     */
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

        // Générer une clé d'accès unique
        $accessKey = $this->generateUniqueAccessKey($entityManager);

        $establishment = new Establishment();
        $establishment->setName($data['name']);
        $establishment->setAddress($data['address']);
        $establishment->setPhone($data['phone']);
        $establishment->setSubscriptionType($data['subscriptionType']);
        $establishment->setModalType($data['modalType']);
        $establishment->setPrice($data['price']);
        $establishment->setMonth($data['month']);
        $establishment->setAccessKey($accessKey); // Utiliser la clé générée
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

    /**
     * Génère une clé d'accès unique de 20 caractères.
     * @throws RandomException
     */
    private function generateUniqueAccessKey(EntityManagerInterface $entityManager): string
    {
        do {
            // Générer une chaîne aléatoire de 20 caractères
            $key = bin2hex(random_bytes(10));  // 10 bytes * 2 = 20 caractères hexadécimaux

            // Vérifier si la clé existe déjà dans la base de données
            $existingKey = $entityManager->getRepository(Establishment::class)
                ->findOneBy(['accessKey' => $key]);
        } while ($existingKey);  // Recommencer tant que la clé n'est pas unique

        return $key;
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
