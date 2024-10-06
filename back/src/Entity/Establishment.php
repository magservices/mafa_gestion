<?php

namespace App\Entity;

use App\Repository\EstablishmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EstablishmentRepository::class)]
class Establishment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $address = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    private ?string $subscriptionType = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column]
    private ?int $month = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $create_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $expiry_date = null;

    #[ORM\Column(length: 255)]
    private ?string $modalType = null;

    #[ORM\Column(length: 255)]
    private ?string $accessKey = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getSubscriptionType(): ?string
    {
        return $this->subscriptionType;
    }

    public function setSubscriptionType(string $subscriptionType): static
    {
        $this->subscriptionType = $subscriptionType;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getMonth(): ?int
    {
        return $this->month;
    }

    public function setMonth(int $month): static
    {
        $this->month = $month;

        return $this;
    }

    public function getCreateAt(): ?\DateTimeImmutable
    {
        return $this->create_at;
    }

    public function setCreateAt(\DateTimeImmutable $create_at): static
    {
        $this->create_at = $create_at;

        return $this;
    }

    public function getExpiryDate(): ?\DateTimeImmutable
    {
        return $this->expiry_date;
    }

    public function setExpiryDate(\DateTimeImmutable $expiry_date): static
    {
        $this->expiry_date = $expiry_date;

        return $this;
    }

    public function getModalType(): ?string
    {
        return $this->modalType;
    }

    public function setModalType(string $modalType): static
    {
        $this->modalType = $modalType;

        return $this;
    }

    public function getAccessKey(): ?string
    {
        return $this->accessKey;
    }

    public function setAccessKey(string $accessKey): static
    {
        $this->accessKey = $accessKey;

        return $this;
    }
}
