-- Inserting the exact 5 hospitals from the JSON specification
INSERT INTO hospitales (estado, tipo, numero_clinica, localidad, procedimientos) VALUES
('Estado de México', 'MF', '001', 'Toluca', '["Anestesia General", "Anestesia Regional", "Sedación"]'::jsonb),
('Estado de México', 'MF', '002', 'Ecatepec', '["Anestesia General", "Anestesia Regional"]'::jsonb),
('Estado de México', 'MF', '007', 'Naucalpan', '["Anestesia General", "Sedación"]'::jsonb),
('Estado de México', 'MF', '010', 'Nezahualcóyotl', '["Anestesia General"]'::jsonb),
('Estado de México', 'HGZ', '057', 'Atizapán', '["Anestesia General", "Anestesia Regional", "Sedación"]'::jsonb)
ON CONFLICT (estado, tipo, numero_clinica) DO NOTHING;
