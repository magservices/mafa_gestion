<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240906233236 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE eleve (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, date_naissance DATE NOT NULL, niveau VARCHAR(50) NOT NULL, classe VARCHAR(50) NOT NULL, prive TINYINT(1) NOT NULL, transfere VARCHAR(50) DEFAULT NULL, matricule VARCHAR(60) DEFAULT NULL, prenom_pere VARCHAR(50) NOT NULL, nom_pere VARCHAR(50) NOT NULL, prenom_mere VARCHAR(50) NOT NULL, nom_mere VARCHAR(50) NOT NULL, tel1 VARCHAR(25) NOT NULL, tel2 VARCHAR(25) DEFAULT NULL, photo_path VARCHAR(100) DEFAULT NULL, photo_name VARCHAR(100) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE mois (id INT AUTO_INCREMENT NOT NULL, payement_id INT NOT NULL, mois VARCHAR(50) NOT NULL, montant DOUBLE PRECISION NOT NULL, INDEX IDX_D6B08CB7868C0609 (payement_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE payement (id INT AUTO_INCREMENT NOT NULL, eleve_id INT NOT NULL, annee_scolaire DATE NOT NULL, fret_incription DOUBLE PRECISION DEFAULT NULL, fret_total DOUBLE PRECISION NOT NULL, fret_mois DOUBLE PRECISION NOT NULL, status VARCHAR(25) NOT NULL, INDEX IDX_B20A7885A6CC7B2 (eleve_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE mois ADD CONSTRAINT FK_D6B08CB7868C0609 FOREIGN KEY (payement_id) REFERENCES payement (id)');
        $this->addSql('ALTER TABLE payement ADD CONSTRAINT FK_B20A7885A6CC7B2 FOREIGN KEY (eleve_id) REFERENCES eleve (id)');
        $this->addSql('ALTER TABLE user CHANGE password password VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE mois DROP FOREIGN KEY FK_D6B08CB7868C0609');
        $this->addSql('ALTER TABLE payement DROP FOREIGN KEY FK_B20A7885A6CC7B2');
        $this->addSql('DROP TABLE eleve');
        $this->addSql('DROP TABLE mois');
        $this->addSql('DROP TABLE payement');
        $this->addSql('ALTER TABLE user CHANGE password password VARCHAR(50) NOT NULL');
    }
}
