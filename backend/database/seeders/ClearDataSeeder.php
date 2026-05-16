<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Payment;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioCertificate;
use App\Models\PortfolioSkill;
use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioAchievement;
use App\Models\PortfolioLink;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ClearDataSeeder extends Seeder
{
    public function run(): void
    {
        echo "--- Menghapus Semua Data Dummy (Kecuali Admin & Template) ---\n";

        // Disable foreign key checks to allow truncation
        Schema::disableForeignKeyConstraints();

        Order::truncate();
        Payment::truncate();
        PortfolioProfile::truncate();
        PortfolioProject::truncate();
        PortfolioCertificate::truncate();
        PortfolioSkill::truncate();
        PortfolioEducation::truncate();
        PortfolioExperience::truncate();
        PortfolioAchievement::truncate();
        PortfolioLink::truncate();
        
        // Delete only non-admin users
        User::where('role', 'user')->delete();

        Schema::enableForeignKeyConstraints();

        echo "--- Data Berhasil Dihapus! ---\n";
    }
}
