package frota_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import frota_api.domain.Caminhao;
import frota_api.domain.Frete;
import frota_api.domain.Motorista;
import frota_api.domain.Rota;
import frota_api.domain.Status;
import frota_api.repository.CaminhaoRepository;
import frota_api.repository.FreteRepository;
import frota_api.repository.MotoristaRepository;
import frota_api.repository.RotaRepository;

@RestController
@RequestMapping("/fretes")
@CrossOrigin("*")
public class FreteController {

    @Autowired
    private CaminhaoRepository caminhaoRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private RotaRepository rotaRepository;

    @Autowired
    private FreteRepository freteRepository;

    @GetMapping
    public List<Frete> listar() {
        return freteRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Frete frete) {

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
            return ResponseEntity.badRequest()
                    .body("Caminhão indisponível");
        }

        if (motorista.getStatus() != Status.DISPONIVEL) {
            return ResponseEntity.badRequest()
                    .body("Motorista indisponível");
        }

        if (frete.getPesoCargaKg() > caminhao.getCapacidadeKg()) {
            return ResponseEntity.badRequest()
                    .body("Peso excede capacidade do caminhão");
        }

        double valorFrete =
                (rota.getDistanciaKm() * 6.50)
                + rota.getPedagio()
                + (frete.getPesoCargaKg() * 0.08);

        frete.setValorFrete(valorFrete);

        frete.setStatus(Status.EM_VIAGEM);

        caminhao.setStatus(Status.EM_VIAGEM);
        motorista.setStatus(Status.EM_VIAGEM);

        caminhaoRepository.save(caminhao);
        motoristaRepository.save(motorista);

        return ResponseEntity.ok(
                freteRepository.save(frete)
        );
    }
}