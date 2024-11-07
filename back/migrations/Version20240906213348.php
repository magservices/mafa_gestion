<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240906213348 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE eleve (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, niveau VARCHAR(50) NOT NULL, classe VARCHAR(50) NOT NULL, prive TINYINT(1) NOT NULL, transfere VARCHAR(50) DEFAULT NULL, matricule VARCHAR(60) DEFAULT NULL, prenom_pere VARCHAR(50) NOT NULL, nom_pere VARCHAR(50) NOT NULL, prenom_mere VARCHAR(50) NOT NULL, nom_mere VARCHAR(50) NOT NULL, tel1 VARCHAR(25) NOT NULL, tel2 VARCHAR(25) DEFAULT NULL, photo_path VARCHAR(100) DEFAULT NULL, photo_name VARCHAR(100) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user CHANGE password password VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE eleve');
        $this->addSql('ALTER TABLE user CHANGE password password VARCHAR(50) NOT NULL');
    }
}
