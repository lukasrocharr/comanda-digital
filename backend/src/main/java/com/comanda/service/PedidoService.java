package com.comanda.service;

import com.comanda.dto.request.PedidoRequest;
import com.comanda.dto.response.PedidoResponse;
import com.comanda.entity.*;
import com.comanda.enums.StatusPedido;
import com.comanda.exception.BusinessException;
import com.comanda.exception.ResourceNotFoundException;
import com.comanda.repository.FichaTecnicaRepository;
import com.comanda.repository.PedidoRepository;
import com.comanda.repository.PratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PratoRepository pratoRepository;
    private final FichaTecnicaRepository fichaRepository;
    private final EstoqueService estoqueService;

    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<PedidoResponse> listarAbertos() {
        return pedidoRepository.findByStatusIn(
            List.of(StatusPedido.RECEBIDO, StatusPedido.CONFIRMADO, StatusPedido.EM_PREPARO, StatusPedido.PRONTO)
        ).stream().map(this::toResponse).toList();
    }

    public List<PedidoResponse> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByCliente_IdOrderByCriadoEmDesc(clienteId)
            .stream().map(this::toResponse).toList();
    }

    public PedidoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public PedidoResponse criar(PedidoRequest req, Usuario cliente) {
        List<PedidoItem> itens = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : req.getItens()) {
            Prato prato = pratoRepository.findById(itemReq.getPratoId())
                .orElseThrow(() -> new ResourceNotFoundException("Prato", itemReq.getPratoId()));
            if (prato.getStatus() != com.comanda.enums.StatusPrato.ATIVO) {
                throw new BusinessException("Prato indisponível: " + prato.getNome());
            }
            PedidoItem item = PedidoItem.builder()
                .prato(prato).quantidade(itemReq.getQuantidade())
                .obs(itemReq.getObs()).precoUnitario(prato.getPreco())
                .build();
            itens.add(item);
            total = total.add(prato.getPreco().multiply(BigDecimal.valueOf(itemReq.getQuantidade())));
        }

        Pedido pedido = Pedido.builder()
            .cliente(cliente).status(StatusPedido.RECEBIDO)
            .total(total).endereco(req.getEndereco())
            .itens(itens).build();

        itens.forEach(i -> i.setPedido(pedido));
        Pedido saved = pedidoRepository.save(pedido);
        return toResponse(saved);
    }

    @Transactional
    public PedidoResponse atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = findById(id);
        validarTransicaoStatus(pedido.getStatus(), novoStatus);
        if (pedido.getStatus() == StatusPedido.RECEBIDO && novoStatus == StatusPedido.CONFIRMADO) {
            baixarEstoque(pedido);
        }
        pedido.setStatus(novoStatus);
        return toResponse(pedidoRepository.save(pedido));
    }

    private void validarTransicaoStatus(StatusPedido atual, StatusPedido novo) {
        if (atual == StatusPedido.CANCELADO || atual == StatusPedido.FINALIZADO) {
            throw new BusinessException("Pedido já encerrado não pode ser alterado.");
        }

        if (novo == StatusPedido.CANCELADO) {
            return;
        }

        if (atual == StatusPedido.RECEBIDO && novo != StatusPedido.CONFIRMADO) {
            throw new BusinessException("Só é permitido confirmar um pedido recebido antes de seguir para preparo.");
        }

        if (atual == StatusPedido.CONFIRMADO && novo != StatusPedido.EM_PREPARO) {
            throw new BusinessException("Só é permitido iniciar o preparo após confirmação.");
        }

        if (atual == StatusPedido.EM_PREPARO && novo != StatusPedido.PRONTO) {
            throw new BusinessException("Só é permitido marcar como pronto após o preparo.");
        }

        if (atual == StatusPedido.PRONTO && novo != StatusPedido.SAIU_ENTREGA) {
            throw new BusinessException("Só é permitido enviar para entrega após o pedido estar pronto.");
        }

        if (atual == StatusPedido.SAIU_ENTREGA && novo != StatusPedido.FINALIZADO) {
            throw new BusinessException("Só é permitido finalizar o pedido após a entrega." );
        }
    }

    private void baixarEstoque(Pedido pedido) {
        String ref = "#" + pedido.getId();
        for (PedidoItem item : pedido.getItens()) {
            fichaRepository.findByPrato_Id(item.getPrato().getId()).ifPresent(ficha -> {
                for (FichaTecnicaItem fichaItem : ficha.getItens()) {
                    BigDecimal qtdTotal = fichaItem.getQuantidade()
                        .multiply(fichaItem.getFatorCorrecao())
                        .multiply(BigDecimal.valueOf(item.getQuantidade()));
                    estoqueService.registrarSaidaVenda(fichaItem.getIngrediente(), qtdTotal, ref);
                }
            });
        }
    }

    private Pedido findById(Long id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
    }

    private PedidoResponse toResponse(Pedido p) {
        List<PedidoResponse.PedidoItemResponse> itens = p.getItens().stream()
            .map(i -> PedidoResponse.PedidoItemResponse.builder()
                .id(i.getId()).pratoId(i.getPrato().getId())
                .pratoNome(i.getPrato().getNome()).pratoEmoji(i.getPrato().getEmoji())
                .quantidade(i.getQuantidade()).obs(i.getObs())
                .precoUnitario(i.getPrecoUnitario())
                .subtotal(i.getPrecoUnitario().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .build()).toList();
        return PedidoResponse.builder()
            .id(p.getId())
            .clienteId(p.getCliente().getId())
            .clienteNome(p.getCliente().getNome())
            .status(p.getStatus()).total(p.getTotal())
            .endereco(p.getEndereco()).criadoEm(p.getCriadoEm())
            .itens(itens).build();
    }
}
