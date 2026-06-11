package com.comanda.service;

import com.comanda.dto.request.MovimentacaoRequest;
import com.comanda.dto.response.MovimentacaoResponse;
import com.comanda.entity.Ingrediente;
import com.comanda.entity.MovimentacaoEstoque;
import com.comanda.entity.Usuario;
import com.comanda.enums.MotivoMovimentacao;
import com.comanda.enums.TipoMovimentacao;
import com.comanda.exception.BusinessException;
import com.comanda.repository.MovimentacaoEstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final MovimentacaoEstoqueRepository repository;
    private final IngredienteService ingredienteService;

    public List<MovimentacaoResponse> listarMovimentacoes() {
        return repository.findAllByOrderByCriadoEmDesc()
            .stream().map(this::toResponse).toList();
    }

    public List<MovimentacaoResponse> listarPorIngrediente(Long ingredienteId) {
        return repository.findByIngrediente_IdOrderByCriadoEmDesc(ingredienteId)
            .stream().map(this::toResponse).toList();
    }

    @Transactional
    public MovimentacaoResponse registrarSaidaManual(MovimentacaoRequest req, Usuario usuario) {
        Ingrediente ing = ingredienteService.findById(req.getIngredienteId());
        if (ing.getSaldoAtual().compareTo(req.getQuantidade()) < 0) {
            throw new BusinessException("Saldo insuficiente para " + ing.getNome());
        }
        ing.setSaldoAtual(ing.getSaldoAtual().subtract(req.getQuantidade()));
        ingredienteService.recalcularStatus(ing);

        MovimentacaoEstoque mov = MovimentacaoEstoque.builder()
            .ingrediente(ing).tipo(TipoMovimentacao.SAIDA)
            .quantidade(req.getQuantidade()).motivo(req.getMotivo())
            .usuario(usuario).build();
        return toResponse(repository.save(mov));
    }

    @Transactional
    public void registrarEntrada(Ingrediente ing, BigDecimal quantidade, BigDecimal precoUnitario, String referencia, Usuario usuario) {
        BigDecimal saldoAnterior = ing.getSaldoAtual();
        BigDecimal custoAnterior = ing.getCustoUnitario();
        BigDecimal totalCustoAnterior = saldoAnterior.multiply(custoAnterior);
        BigDecimal totalCustoEntrada = precoUnitario.multiply(quantidade);
        BigDecimal novoSaldo = saldoAnterior.add(quantidade);

        if (novoSaldo.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal novoCusto = totalCustoAnterior.add(totalCustoEntrada)
                .divide(novoSaldo, 4, RoundingMode.HALF_UP);
            ing.setCustoUnitario(novoCusto);
        } else {
            ing.setCustoUnitario(precoUnitario);
        }

        ing.setSaldoAtual(novoSaldo);
        ingredienteService.recalcularStatus(ing);

        MovimentacaoEstoque mov = MovimentacaoEstoque.builder()
            .ingrediente(ing).tipo(TipoMovimentacao.ENTRADA)
            .quantidade(quantidade).motivo(MotivoMovimentacao.COMPRA)
            .referencia(referencia).usuario(usuario).build();
        repository.save(mov);
    }

    @Transactional
    public void registrarSaidaVenda(Ingrediente ing, BigDecimal quantidade, String referencia) {
        ing.setSaldoAtual(ing.getSaldoAtual().subtract(quantidade));
        if (ing.getSaldoAtual().compareTo(BigDecimal.ZERO) < 0) {
            ing.setSaldoAtual(BigDecimal.ZERO);
        }
        ingredienteService.recalcularStatus(ing);

        MovimentacaoEstoque mov = MovimentacaoEstoque.builder()
            .ingrediente(ing).tipo(TipoMovimentacao.SAIDA)
            .quantidade(quantidade).motivo(MotivoMovimentacao.VENDA)
            .referencia(referencia).build();
        repository.save(mov);
    }

    private MovimentacaoResponse toResponse(MovimentacaoEstoque m) {
        return MovimentacaoResponse.builder()
            .id(m.getId())
            .ingredienteId(m.getIngrediente().getId())
            .ingredienteNome(m.getIngrediente().getNome())
            .tipo(m.getTipo()).quantidade(m.getQuantidade())
            .motivo(m.getMotivo()).referencia(m.getReferencia())
            .usuarioNome(m.getUsuario() != null ? m.getUsuario().getNome() : "Sistema")
            .criadoEm(m.getCriadoEm())
            .build();
    }
}
