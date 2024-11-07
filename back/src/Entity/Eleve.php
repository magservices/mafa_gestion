<?php

namespace App\Entity;

use App\Repository\EleveRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EleveRepository::class)]
class Eleve
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $nom = null;

    #[ORM\Column(length: 50)]
    private ?string $prenom = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateNaissance = null;

    #[ORM\Column(length: 50)]
    private ?string $niveau = null;

    #[ORM\Column(length: 50)]
    private ?string $classe = null;

    #[ORM\Column]
    private ?bool $prive = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $transfere = null;

    #[ORM\Column(length: 60, nullable: true)]
    private ?string $matricule = null;

    #[ORM\Column(length: 50)]
    private ?string $prenomPere = null;

    #[ORM\Column(length: 50)]
    private ?string $nomPere = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $prenomMere = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $nomMere = null;

    #[ORM\Column(length: 25)]
    private ?string $tel1 = null;

    #[ORM\Column(length: 25, nullable: true)]
    private ?string $tel2 = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photoPath = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photoName = null;



    /**
     * @var Collection<int, StudentPayment>
     */
    #[ORM\OneToMany(targetEntity: StudentPayment::class, mappedBy: 'registerStudent')]
    private Collection $registerPaymentStudent;

    #[ORM\Column(length: 255)]
    private ?string $studentID = null;

    #[ORM\Column(length: 255)]
    private ?string $establishment = null;

    #[ORM\Column(length: 255)]
    private ?string $userkey = null;


    public function __construct()
    {
        $this->registerPaymentStudent = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getDateNaissance(): ?\DateTimeInterface
    {
    return $this->dateNaissance;
    }

    public function setDateNaissance(?\DateTimeInterface $dateNaissance): static
    {
    $this->dateNaissance = $dateNaissance;

    return $this;
    }


    public function getNiveau(): ?string
    {
        return $this->niveau;
    }

    public function setNiveau(string $niveau): static
    {
        $this->niveau = $niveau;

        return $this;
    }

    public function getClasse(): ?string
    {
        return $this->classe;
    }

    public function setClasse(string $classe): static
    {
        $this->classe = $classe;

        return $this;
    }

    public function isPrive(): ?bool
    {
        return $this->prive;
    }

    public function setPrive(bool $prive): static
    {
        $this->prive = $prive;

        return $this;
    }

    public function getTransfere(): ?string
    {
        return $this->transfere;
    }

    public function setTransfere(?string $transfere): static
    {
        $this->transfere = $transfere;

        return $this;
    }

    public function getMatricule(): ?string
    {
        return $this->matricule;
    }

    public function setMatricule(?string $matricule): static
    {
        $this->matricule = $matricule;

        return $this;
    }

    public function getPrenomPere(): ?string
    {
        return $this->prenomPere;
    }

    public function setPrenomPere(string $prenomPere): static
    {
        $this->prenomPere = $prenomPere;

        return $this;
    }

    public function getNomPere(): ?string
    {
        return $this->nomPere;
    }

    public function setNomPere(string $nomPere): static
    {
        $this->nomPere = $nomPere;

        return $this;
    }

    public function getPrenomMere(): ?string
    {
        return $this->prenomMere;
    }

    public function setPrenomMere(string $prenomMere): static
    {
        $this->prenomMere = $prenomMere;

        return $this;
    }

    public function getNomMere(): ?string
    {
        return $this->nomMere;
    }

    public function setNomMere(string $nomMere): static
    {
        $this->nomMere = $nomMere;

        return $this;
    }

    public function getTel1(): ?string
    {
        return $this->tel1;
    }

    public function setTel1(string $tel1): static
    {
        $this->tel1 = $tel1;

        return $this;
    }

    public function getTel2(): ?string
    {
        return $this->tel2;
    }

    public function setTel2(?string $tel2): static
    {
        $this->tel2 = $tel2;

        return $this;
    }

    public function getPhotoPath(): ?string
    {
        return $this->photoPath;
    }

    public function setPhotoPath(?string $photoPath): static
    {
        $this->photoPath = $photoPath;

        return $this;
    }

    public function getPhotoName(): ?string
    {
        return $this->photoName;
    }

    public function setPhotoName(?string $photoName): static
    {
        $this->photoName = $photoName;

        return $this;
    }


    /**
     * @return Collection<int, StudentPayment>
     */
    public function getRegisterPaymentStudent(): Collection
    {
        return $this->registerPaymentStudent;
    }

    public function addRegisterPaymentStudent(StudentPayment $registerPaymentStudent): static
    {
        if (!$this->registerPaymentStudent->contains($registerPaymentStudent)) {
            $this->registerPaymentStudent->add($registerPaymentStudent);
            $registerPaymentStudent->setRegisterStudent($this);
        }

        return $this;
    }

    public function removeRegisterPaymentStudent(StudentPayment $registerPaymentStudent): static
    {
        if ($this->registerPaymentStudent->removeElement($registerPaymentStudent)) {
            // set the owning side to null (unless already changed)
            if ($registerPaymentStudent->getRegisterStudent() === $this) {
                $registerPaymentStudent->setRegisterStudent(null);
            }
        }

        return $this;
    }

    public function getStudentID(): ?string
    {
        return $this->studentID;
    }

    public function setStudentID(string $studentID): static
    {
        $this->studentID = $studentID;

        return $this;
    }

    public function getEstablishment(): ?string
    {
        return $this->establishment;
    }

    public function setEstablishment(string $establishment): static
    {
        $this->establishment = $establishment;

        return $this;
    }

    public function getUserkey(): ?string
    {
        return $this->userkey;
    }

    public function setUserkey(string $userkey): static
    {
        $this->userkey = $userkey;

        return $this;
    }

}
