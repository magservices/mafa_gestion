<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241111184423 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE eleve CHANGE date_naissance date_naissance DATE DEFAULT NULL');
        $this->addSql('ALTER TABLE student_payment ADD CONSTRAINT FK_801E31F59E199B20 FOREIGN KEY (register_student_id) REFERENCES eleve (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE eleve CHANGE date_naissance date_naissance DATE NOT NULL');
        $this->addSql('ALTER TABLE student_payment DROP FOREIGN KEY FK_801E31F59E199B20');
    }
}
