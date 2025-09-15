-- Seed admin user (password: admin123)
INSERT INTO users (id, email, password_hash, role, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@harasniltonlins.com', '$2b$10$rQvTUWJl8/aNyOHyJz5yxuZOZOQGWq9UpK9HJOyK8KzK3mJOJMxXy', 'ADMIN', 'Administrador');

-- Seed instructor user (password: instructor123)
INSERT INTO users (id, email, password_hash, role, name) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'instructor@harasniltonlins.com', '$2b$10$rQvTUWJl8/aNyOHyJz5yxuZOZOQGWq9UpK9HJOyK8KzK3mJOJMxXy', 'INSTRUCTOR', 'Instrutor João');

-- Seed plans
INSERT INTO plans (id, name, description, price_cents, credits_included, duration_days, is_active) VALUES 
('plan-basic-monthly', 'Plano Básico Mensal', 'Acesso a 4 aulas por mês', 20000, 4, 30, true),
('plan-premium-monthly', 'Plano Premium Mensal', 'Acesso a 8 aulas por mês', 35000, 8, 30, true),
('plan-unlimited-monthly', 'Plano Ilimitado Mensal', 'Acesso ilimitado às aulas', 50000, 999, 30, true);

-- Seed time slots (Monday to Friday, 8:00-18:00, Saturday 8:00-12:00)
INSERT INTO time_slots (day_of_week, start_time, end_time, max_capacity, is_active) VALUES 
-- Monday (1)
(1, '08:00', '09:00', 2, true),
(1, '09:00', '10:00', 2, true),
(1, '10:00', '11:00', 2, true),
(1, '11:00', '12:00', 2, true),
(1, '14:00', '15:00', 2, true),
(1, '15:00', '16:00', 2, true),
(1, '16:00', '17:00', 2, true),
(1, '17:00', '18:00', 2, true),

-- Tuesday (2)
(2, '08:00', '09:00', 2, true),
(2, '09:00', '10:00', 2, true),
(2, '10:00', '11:00', 2, true),
(2, '11:00', '12:00', 2, true),
(2, '14:00', '15:00', 2, true),
(2, '15:00', '16:00', 2, true),
(2, '16:00', '17:00', 2, true),
(2, '17:00', '18:00', 2, true),

-- Wednesday (3)
(3, '08:00', '09:00', 2, true),
(3, '09:00', '10:00', 2, true),
(3, '10:00', '11:00', 2, true),
(3, '11:00', '12:00', 2, true),
(3, '14:00', '15:00', 2, true),
(3, '15:00', '16:00', 2, true),
(3, '16:00', '17:00', 2, true),
(3, '17:00', '18:00', 2, true),

-- Thursday (4)
(4, '08:00', '09:00', 2, true),
(4, '09:00', '10:00', 2, true),
(4, '10:00', '11:00', 2, true),
(4, '11:00', '12:00', 2, true),
(4, '14:00', '15:00', 2, true),
(4, '15:00', '16:00', 2, true),
(4, '16:00', '17:00', 2, true),
(4, '17:00', '18:00', 2, true),

-- Friday (5)
(5, '08:00', '09:00', 2, true),
(5, '09:00', '10:00', 2, true),
(5, '10:00', '11:00', 2, true),
(5, '11:00', '12:00', 2, true),
(5, '14:00', '15:00', 2, true),
(5, '15:00', '16:00', 2, true),
(5, '16:00', '17:00', 2, true),
(5, '17:00', '18:00', 2, true),

-- Saturday (6)
(6, '08:00', '09:00', 2, true),
(6, '09:00', '10:00', 2, true),
(6, '10:00', '11:00', 2, true),
(6, '11:00', '12:00', 2, true);

-- Seed sample holidays
INSERT INTO holidays (name, date, is_recurring) VALUES 
('Ano Novo', '2024-01-01', true),
('Carnaval', '2024-02-12', false),
('Carnaval', '2024-02-13', false),
('Sexta-feira Santa', '2024-03-29', false),
('Tiradentes', '2024-04-21', true),
('Dia do Trabalhador', '2024-05-01', true),
('Independência do Brasil', '2024-09-07', true),
('Nossa Senhora Aparecida', '2024-10-12', true),
('Finados', '2024-11-02', true),
('Proclamação da República', '2024-11-15', true),
('Natal', '2024-12-25', true);