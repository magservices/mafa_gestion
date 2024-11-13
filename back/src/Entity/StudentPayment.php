<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\StudentPaymentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StudentPaymentRepository::class)]
#[ApiResource]
class StudentPayment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $totalAnnualCosts = null;

    #[ORM\Column(length: 255)]
    private ?string $paymentReason = null;

    #[ORM\Column(length: 255)]
    private ?string $paymentStatus = null;


    #[ORM\Column]
    private ?int $amount = null;

    #[ORM\Column(length: 255)]
    private ?string $month = null;

    /**
     * @JsonIgnore
     */
    #[ORM\ManyToOne(inversedBy: 'registerPaymentStudent')]
    private ?Eleve $registerStudent = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createAt = null;

    #[ORM\Column]
    private ?bool $fees = null;

   /* #[ORM\Column(nullable: true)]
    private ?int $month_total = null;*/

    #[ORM\Column(length: 255)]
    private ?string $establishment = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalAnnualCosts(): ?int
    {
        return $this->totalAnnualCosts;
    }

    public function setTotalAnnualCosts(int $totalAnnualCosts): static
    {
        $this->totalAnnualCosts = $totalAnnualCosts;

        return $this;
    }

    public function getPaymentReason(): ?string
    {
        return $this->paymentReason;
    }

    public function setPaymentReason(string $paymentReason): static
    {
        $this->paymentReason = $paymentReason;

        return $this;
    }

    public function getPaymentStatus(): ?string
    {
        return $this->paymentStatus;
    }

    public function setPaymentStatus(string $paymentStatus): static
    {
        $this->paymentStatus = $paymentStatus;

        return $this;
    }


    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getMonth(): ?string
    {
        return $this->month;
    }

    public function setMonth(string $month): static
    {
        $this->month = $month;

        return $this;
    }

    public function getRegisterStudent(): ?Eleve
    {
        return $this->registerStudent;
    }

    public function setRegisterStudent(?Eleve $registerStudent): static
    {
        $this->registerStudent = $registerStudent;

        return $this;
    }

    public function getCreateAt(): ?\DateTimeImmutable
    {
        return $this->createAt;
    }

    public function setCreateAt(\DateTimeImmutable $createAt): static
    {
        $this->createAt = $createAt;

        return $this;
    }

    public function isFees(): ?bool
    {
        return $this->fees;
    }

    public function setFees(bool $fees): static
    {
        $this->fees = $fees;

        return $this;
    }

   /* public function getMonthTotal(): ?int
    {
        return $this->month_total;
    }

    public function setMonthTotal(?int $month_total): static
    {
        $this->month_total = $month_total;

        return $this;
    }*/

    public function getEstablishment(): ?string
    {
        return $this->establishment;
    }

    public function setEstablishment(string $establishment): static
    {
        $this->establishment = $establishment;

        return $this;
    }
}
