<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240912231038 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE payement DROP FOREIGN KEY FK_B20A7885A6CC7B2');
        $this->addSql('ALTER TABLE mois DROP FOREIGN KEY FK_D6B08CB7868C0609');
        $this->addSql('DROP TABLE payement');
        $this->addSql('DROP TABLE mois');
        $this->addSql('ALTER TABLE eleve ADD student_id VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user DROP login');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE payement (id INT AUTO_INCREMENT NOT NULL, eleve_id INT NOT NULL, fret_total DOUBLE PRECISION NOT NULL, annee_scolaire VARCHAR(25) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, fret_incription DOUBLE PRECISION DEFAULT NULL, fret_mois DOUBLE PRECISION DEFAULT NULL, status VARCHAR(25) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_B20A7885A6CC7B2 (eleve_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE mois (id INT AUTO_INCREMENT NOT NULL, payement_id INT NOT NULL, mois VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, montant DOUBLE PRECISION NOT NULL, INDEX IDX_D6B08CB7868C0609 (payement_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE payement ADD CONSTRAINT FK_B20A7885A6CC7B2 FOREIGN KEY (eleve_id) REFERENCES eleve (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE mois ADD CONSTRAINT FK_D6B08CB7868C0609 FOREIGN KEY (payement_id) REFERENCES payement (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE eleve DROP student_id');
        $this->addSql('ALTER TABLE user ADD login VARCHAR(50) NOT NULL');
    }
}
