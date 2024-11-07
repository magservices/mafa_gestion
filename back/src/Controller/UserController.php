<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user-register')]
class UserController extends AbstractController
{
    private $entityManager;
    private $userRepository;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    // Create a new user
    #[Route('/create', name: 'create_user_connexion', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Valider les données reçues (optionnel mais recommandé)
        if (empty($data['password']) || empty($data['email']) || empty($data['nom'])) {
            return new JsonResponse(['error' => 'Missing required fields.'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        $user->setRoles($data['roles']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setTel($data['tel']);
        $user->setEmail($data['email']);
        $user->setLoginEstablishment($data['login_establishment']);

        // Générer une clé unique pour l'utilisateur
        $userKey = $this->generateUniqueAccessKey($this->entityManager);
        $user->setUserKey($userKey);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['user' => $user], Response::HTTP_CREATED);
    }

    private function generateUniqueAccessKey(EntityManagerInterface $entityManager): string
    {
        do {
            // Générer une chaîne aléatoire de 12 caractères
            $key = bin2hex(random_bytes(6));  // 6 bytes * 2 = 12 caractères hexadécimaux

            // Vérifier si la clé existe déjà dans la base de données
            $existingKey = $entityManager->getRepository(User::class) // Changer Establishment par User
            ->findOneBy(['userKey' => $key]);
        } while ($existingKey);  // Recommencer tant que la clé n'est pas unique

        return $key;
    }


    // Update an existing user
    #[Route('/{id}', name: 'update_user_connexion', methods: ['POST'])]
    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['status' => 'User not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);
        $user->setNom($data['nom'] ?? $user->getNom());
        $user->setPrenom($data['prenom'] ?? $user->getPrenom());
        $user->setTel($data['tel'] ?? $user->getTel());
        $user->setEmail($data['mail'] ?? $user->getEmail());
        $user->setLoginEstablishment($data['login_establishment'] ?? $user->getLoginEstablishment());
        $user->setUserKey($data['userKey'] ?? $user->getUserKey());
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'User updated!'], Response::HTTP_OK);
    }

    // Delete a user
    #[Route('/{id}', name: 'delete_user_connexion', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['status' => 'User not found!'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'User deleted!'], Response::HTTP_OK);
    }

    // Get a user by ID
    #[Route('/key/{userKey}', name: 'get_user_by_userKey', methods: ['GET'])]
    public function getUserByUserKey(string $userKey): JsonResponse
    {
        // Utiliser findOneBy pour rechercher un utilisateur par son userKey
        $user = $this->userRepository->findOneBy(['userKey' => $userKey]);

        if (!$user) {
            return new JsonResponse(['status' => 'User not found!'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $user->getId(),
            'roles' => $user->getRoles(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'tel' => $user->getTel(),
            'mail' => $user->getEmail(),
            'loginEstablishment' => $user->getLoginEstablishment(),
            'userKey' => $user->getUserKey(),
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }


    #[Route('/all/', name: 'get_all_users_connexion', methods: ['GET'])]
    public function getAllUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        // Vérifier si la liste des utilisateurs est vide
        if (empty($users)) {
            return new JsonResponse(['status' => 'No users found!'], Response::HTTP_NOT_FOUND);
        }

        // Créer un tableau pour stocker les données des utilisateurs
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'roles' => $user->getRoles(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'tel' => $user->getTel(),
                'mail' => $user->getEmail(),
                'loginEstablishment' => $user->getLoginEstablishment(),
                'userKey' => $user->getUserKey(),
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

}
