package frota_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import frota_api.domain.Frete;

public interface FreteRepository extends JpaRepository<Frete, Long> {
}