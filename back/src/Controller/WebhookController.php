<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route("/api/webhook")]
class WebhookController extends AbstractController
{
    #[Route('/notify', name: 'app_notify', methods: ['POST'])]
    public function notify(Request $request): JsonResponse
    {
        // Récupérer les données envoyées par le webhook
        $data = json_decode($request->getContent(), true);

        // Traiter les données (vous pouvez les stocker ou les utiliser selon vos besoins)
        // Exemple : Vous pouvez envoyer des notifications ou mettre à jour une base de données

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
