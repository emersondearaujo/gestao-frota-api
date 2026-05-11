package frota_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import frota_api.domain.Rota;

public interface RotaRepository extends JpaRepository<Rota, Long> {
}