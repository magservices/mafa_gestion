<?php

namespace App\Entity;

use App\Repository\PayementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
#[ORM\Entity(repositoryClass: PayementRepository::class)]
class Payement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $anneeScolaire = null;

    #[ORM\Column(nullable: true)]
    private ?float $fretIncription = null;

    #[ORM\Column]
    private ?float $fretTotal = null;
    #[ORM\Column(nullable: true)]
    private ?float $fretMois = null;

   

    #[ORM\Column(length: 25)]
    private ?string $status = null;

    #[ORM\ManyToOne(targetEntity: Eleve::class, inversedBy: 'paiements')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Eleve $eleve = null;

    #[ORM\OneToMany(targetEntity: Mois::class, mappedBy: 'payement')]
    private Collection $mois;

    public function __construct()
    {
        $this->mois = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnneeScolaire(): ?string
    {
        return $this->anneeScolaire;
    }

    public function setAnneeScolaire(string $anneeScolaire): static
    {
        $this->anneeScolaire = $anneeScolaire;

        return $this;
    }

    public function getFretIncription(): ?float
    {
        return $this->fretIncription;
    }

    public function setFretIncription(?float $fretIncription): static
    {
        $this->fretIncription = $fretIncription;

        return $this;
    }

    public function getFretTotal(): ?float
    {
        return $this->fretTotal;
    }

    public function setFretTotal(float $fretTotal): static
    {
        $this->fretTotal = $fretTotal;

        return $this;
    }


    public function getFretMois(): ?float
    {
        return $this->fretMois;
    }

    public function setFretMois(float $fretMois): static
    {
        $this->fretMois = $fretMois;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getEleve(): ?Eleve
    {
        return $this->eleve;
    }

    public function setEleve(?Eleve $eleve): static
    {
        $this->eleve = $eleve;

        return $this;
    }

    public function getMois(): Collection
    {
        return $this->mois;
    }
}
