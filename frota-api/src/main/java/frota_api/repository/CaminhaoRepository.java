package frota_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import frota_api.domain.Caminhao;

public interface CaminhaoRepository extends JpaRepository<Caminhao, Long> {
}