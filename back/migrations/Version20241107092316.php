<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241107092316 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE eleve (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, date_naissance DATE NOT NULL, niveau VARCHAR(50) NOT NULL, classe VARCHAR(50) NOT NULL, prive TINYINT(1) NOT NULL, transfere VARCHAR(50) DEFAULT NULL, matricule VARCHAR(60) DEFAULT NULL, prenom_pere VARCHAR(50) NOT NULL, nom_pere VARCHAR(50) NOT NULL, prenom_mere VARCHAR(50) DEFAULT NULL, nom_mere VARCHAR(50) DEFAULT NULL, tel1 VARCHAR(25) NOT NULL, tel2 VARCHAR(25) DEFAULT NULL, photo_path VARCHAR(255) DEFAULT NULL, photo_name VARCHAR(255) DEFAULT NULL, student_id VARCHAR(255) NOT NULL, establishment VARCHAR(255) NOT NULL, userkey VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE establishment (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, subscription_type VARCHAR(255) NOT NULL, price INT NOT NULL, month INT NOT NULL, create_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', expiry_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', modal_type VARCHAR(255) NOT NULL, access_key VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE student_payment (id INT AUTO_INCREMENT NOT NULL, register_student_id INT DEFAULT NULL, total_annual_costs INT NOT NULL, payment_reason VARCHAR(255) NOT NULL, payment_status VARCHAR(255) NOT NULL, amount INT NOT NULL, month VARCHAR(255) NOT NULL, create_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', fees TINYINT(1) NOT NULL, month_total INT DEFAULT NULL, establishment VARCHAR(255) NOT NULL, INDEX IDX_801E31F59E199B20 (register_student_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, tel VARCHAR(20) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, login_establishment VARCHAR(255) NOT NULL, user_key VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE student_payment ADD CONSTRAINT FK_801E31F59E199B20 FOREIGN KEY (register_student_id) REFERENCES eleve (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE student_payment DROP FOREIGN KEY FK_801E31F59E199B20');
        $this->addSql('DROP TABLE eleve');
        $this->addSql('DROP TABLE establishment');
        $this->addSql('DROP TABLE student_payment');
        $this->addSql('DROP TABLE user');
    }
}
