<?php

namespace App\Controller;

use App\Entity\UserConnexion;
use App\Repository\UserConnexionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user-connexion')]
class UserConnexionController extends AbstractController
{
    private $entityManager;
    private $userConnexionRepository;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserConnexionRepository $userConnexionRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->userConnexionRepository = $userConnexionRepository;
        $this->passwordHasher = $passwordHasher;
    }

    // Create a new UserConnexion
    #[Route('', name: 'create_user_connexion', methods: ['POST'])]
    public function createUserConnexion(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $userConnexion = new UserConnexion();
        $userConnexion->setLogin($data['login']);
        $hashedPassword = $this->passwordHasher->hashPassword($userConnexion, $data['password']);
        $userConnexion->setPassword($hashedPassword);
        $userConnexion->setRole($data['role']);
        $userConnexion->setNom($data['nom']);
        $userConnexion->setPrenom($data['prenom']);
        $userConnexion->setTel($data['tel']);
        $userConnexion->setMail($data['mail']);

        $this->entityManager->persist($userConnexion);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'UserConnexion created!'], Response::HTTP_CREATED);
    }

    // Update an existing UserConnexion
    #[Route('/{id}', name: 'update_user_connexion', methods: ['PUT'])]
    public function updateUserConnexion(Request $request, int $id): JsonResponse
    {
        $userConnexion = $this->userConnexionRepository->find($id);

        if (!$userConnexion) {
            return new JsonResponse(['status' => 'UserConnexion not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $userConnexion->setLogin($data['login'] ?? $userConnexion->getLogin());
        if (isset($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($userConnexion, $data['password']);
            $userConnexion->setPassword($hashedPassword);
        }
        $userConnexion->setRole($data['role'] ?? $userConnexion->getRole());
        $userConnexion->setNom($data['nom'] ?? $userConnexion->getNom());
        $userConnexion->setPrenom($data['prenom'] ?? $userConnexion->getPrenom());
        $userConnexion->setTel($data['tel'] ?? $userConnexion->getTel());
        $userConnexion->setMail($data['mail'] ?? $userConnexion->getMail());

        $this->entityManager->flush();

        return new JsonResponse(['status' => 'UserConnexion updated!'], Response::HTTP_OK);
    }

    // Delete a UserConnexion
    #[Route('/{id}', name: 'delete_user_connexion', methods: ['DELETE'])]
    public function deleteUserConnexion(int $id): JsonResponse
    {
        $userConnexion = $this->userConnexionRepository->find($id);

        if (!$userConnexion) {
            return new JsonResponse(['status' => 'UserConnexion not found!'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($userConnexion);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'UserConnexion deleted!'], Response::HTTP_OK);
    }

    // Get a UserConnexion by ID
    #[Route('/{id}', name: 'get_user_connexion', methods: ['GET'])]
    public function getUserConnexion(int $id): JsonResponse
    {
        $userConnexion = $this->userConnexionRepository->find($id);

        if (!$userConnexion) {
            return new JsonResponse(['status' => 'UserConnexion not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $userConnexion->getId(),
            'login' => $userConnexion->getLogin(),
            'role' => $userConnexion->getRole(),
            'nom' => $userConnexion->getNom(),
            'prenom' => $userConnexion->getPrenom(),
            'tel' => $userConnexion->getTel(),
            'mail' => $userConnexion->getMail(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
