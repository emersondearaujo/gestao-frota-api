package frota_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import frota_api.domain.Motorista;

public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
}