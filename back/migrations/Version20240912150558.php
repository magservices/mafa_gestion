<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240912150558 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE student_payment (id INT AUTO_INCREMENT NOT NULL, register_student_id INT DEFAULT NULL, total_annual_costs INT NOT NULL, payment_reason VARCHAR(255) NOT NULL, payment_status VARCHAR(255) NOT NULL, amount INT NOT NULL, month VARCHAR(255) NOT NULL, INDEX IDX_801E31F59E199B20 (register_student_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE student_payment ADD CONSTRAINT FK_801E31F59E199B20 FOREIGN KEY (register_student_id) REFERENCES eleve (id)');
        $this->addSql('ALTER TABLE payement ADD fret_mois DOUBLE PRECISION DEFAULT NULL, ADD status VARCHAR(25) NOT NULL, DROP motif_paiement, DROP mois_paye, CHANGE statut annee_scolaire VARCHAR(25) NOT NULL, CHANGE montant_paye fret_incription DOUBLE PRECISION DEFAULT NULL, CHANGE frais_total_annuel fret_total DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE student_payment DROP FOREIGN KEY FK_801E31F59E199B20');
        $this->addSql('DROP TABLE student_payment');
        $this->addSql('ALTER TABLE payement ADD motif_paiement VARCHAR(255) NOT NULL, ADD statut VARCHAR(25) NOT NULL, ADD mois_paye VARCHAR(255) NOT NULL, ADD montant_paye DOUBLE PRECISION DEFAULT NULL, DROP annee_scolaire, DROP fret_incription, DROP fret_mois, DROP status, CHANGE fret_total frais_total_annuel DOUBLE PRECISION NOT NULL');
    }
}
