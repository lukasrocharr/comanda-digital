package db.migration;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class V4__add_admin_comanda extends BaseJavaMigration {

    @Override
    public void migrate(Context context) throws Exception {
        // Check if admin@comanda.com exists
        try (PreparedStatement ps = context.getConnection().prepareStatement("SELECT count(*) FROM usuarios WHERE email = ?")) {
            ps.setString(1, "admin@comanda.com");
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                int count = rs.getInt(1);
                if (count == 0) {
                    String hash = new BCryptPasswordEncoder().encode("admin123");
                    try (PreparedStatement ins = context.getConnection().prepareStatement(
                            "INSERT INTO usuarios (nome, email, senha, perfil, status, criado_em) VALUES (?, ?, ?, ?, ?, NOW())")) {
                        ins.setString(1, "Admin Sistema");
                        ins.setString(2, "admin@comanda.com");
                        ins.setString(3, hash);
                        ins.setString(4, "ADMIN");
                        ins.setString(5, "ATIVO");
                        ins.executeUpdate();
                    }
                }
            }
        }
    }
}
