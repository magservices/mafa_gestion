<?php

namespace App\Entity;

use App\Repository\MoisRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MoisRepository::class)]
class Mois
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $mois = null;

    #[ORM\Column]
    private ?float $montant = null;
    #[ORM\ManyToOne(targetEntity: Payement::class, inversedBy: 'mois')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Payement $payement = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMois(): ?string
    {
        return $this->mois;
    }

    public function setMois(string $mois): static
    {
        $this->mois = $mois;

        return $this;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant(float $montant): static
    {
        $this->montant = $montant;

        return $this;
    }
    public function getPayement(): ?Payement
    {
        return $this->payement;
    }

    public function setEleve(?Payement $payement): static
    {
        $this->payement = $payement;

        return $this;
    }
}
