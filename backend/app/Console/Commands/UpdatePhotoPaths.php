<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdatePhotoPaths extends Command
{
    protected $signature = 'app:update-photo-paths';
    protected $description = 'Update all photo paths to point to portfolio/foto-profil/';

    public function handle()
    {
        $this->info('Updating photo paths...');

        $this->updateTable('portfolio_profiles', 'foto_profil');
        $this->updateTable('portfolio_projects', 'gambar_project');
        $this->updateTable('portfolio_certificates', 'file_sertifikat');
        $this->updateTable('payments', 'foto_bukti_pembayaran');

        $this->info('Done!');
    }

    private function updateTable($table, $column)
    {
        $rows = DB::table($table)->whereNotNull($column)->get();
        foreach ($rows as $row) {
            $path = $row->$column;
            
            // Extract filename from the path
            $basename = basename($path);
            
            // If it has a query string, clean it
            if (strpos($basename, '?') !== false) {
                $basename = explode('?', $basename)[0];
            }
            
            $newPath = 'portfolio/foto-profil/' . $basename;
            
            if ($path !== $newPath && !empty($path)) {
                DB::table($table)->where('id', $row->id)->update([$column => $newPath]);
                $this->info("Updated {$table}: {$path} -> {$newPath}");
            }
        }
    }
}
