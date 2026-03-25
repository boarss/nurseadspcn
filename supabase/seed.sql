-- Clinics seed data
INSERT INTO public.clinics (name, address, contact, specialties) VALUES
('Lagos General Hospital', 'Odan, Lagos Island, Lagos', '+234 1 234 5678', ARRAY['General Medicine', 'Maternity', 'Pediatrics']),
('National Hospital Abuja', 'Plot 132 Central Business District, Abuja', '+234 9 234 5678', ARRAY['General Medicine', 'Trauma', 'Cardiology']),
('University College Hospital', 'Queen Elizabeth Road, Ibadan, Oyo', '+234 2 234 5678', ARRAY['General Medicine', 'Oncology', 'Neurology']);
