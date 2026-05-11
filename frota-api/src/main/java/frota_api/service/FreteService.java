package frota_api.service;

import org.springframework.stereotype.Service;

import frota_api.domain.Caminhao;
import frota_api.domain.Frete;
import frota_api.domain.Motorista;
import frota_api.domain.Rota;
import frota_api.domain.Status;
import frota_api.repository.CaminhaoRepository;
import frota_api.repository.FreteRepository;
import frota_api.repository.MotoristaRepository;
import frota_api.repository.RotaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FreteService {

    private final FreteRepository repository;
    private final CaminhaoRepository caminhaoRepository;
    private final MotoristaRepository motoristaRepository;
    private final RotaRepository rotaRepository;

    public Frete criarFrete(Frete frete) {

        Caminhao caminhao = caminhaoRepository.findById(
                frete.getCaminhao().getId()
        ).orElseThrow();

        Motorista motorista = motoristaRepository.findById(
                frete.getMotorista().getId()
        ).orElseThrow();

        Rota rota = rotaRepository.findById(
                frete.getRota().getId()
        ).orElseThrow();

        if (caminhao.getStatus() != Status.DISPONIVEL) {
            throw new RuntimeException("Caminhão indisponível");
        }

        if (motorista.getStatus() != Status.DISPONIVEL) {
            throw new RuntimeException("Motorista indisponível");
        }

        if (frete.getPesoCargaKg() > caminhao.getCapacidadeKg()) {
            throw new RuntimeException("Peso excede capacidade do caminhão");
        }

        Double valor =
                (rota.getDistanciaKm() * 6.5)
                + rota.getPedagio()
                + (frete.getPesoCargaKg() * 0.08);

        frete.setCaminhao(caminhao);
        frete.setMotorista(motorista);
        frete.setRota(rota);

        frete.setValorFrete(valor);

        frete.setStatus(Status.EM_VIAGEM);

        caminhao.setStatus(Status.EM_VIAGEM);
        motorista.setStatus(Status.EM_VIAGEM);

        caminhaoRepository.save(caminhao);
        motoristaRepository.save(motorista);

        return repository.save(frete);
    }

    public Frete finalizarFrete(Frete frete) {

        frete.setStatus(Status.FINALIZADO);

        Caminhao caminhao = frete.getCaminhao();
        Motorista motorista = frete.getMotorista();

        caminhao.setStatus(Status.DISPONIVEL);
        motorista.setStatus(Status.DISPONIVEL);

        caminhaoRepository.save(caminhao);
        motoristaRepository.save(motorista);

        return repository.save(frete);
    }
}