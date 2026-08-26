alter table public.service_requests
  add constraint service_requests_name_len check (client_name is null or char_length(client_name) <= 200),
  add constraint service_requests_email_len check (email is null or char_length(email) <= 320),
  add constraint service_requests_whatsapp_len check (whatsapp is null or char_length(whatsapp) <= 40),
  add constraint service_requests_service_len check (
    (service_id is null or char_length(service_id) <= 120)
    and (service_title is null or char_length(service_title) <= 200)
    and (project_name is null or char_length(project_name) <= 200)
  ),
  add constraint service_requests_text_len check (
    (description is null or char_length(description) <= 5000)
    and (scope is null or char_length(scope) <= 2000)
    and (budget is null or char_length(budget) <= 120)
    and (timeline is null or char_length(timeline) <= 120)
    and (platform is null or char_length(platform) <= 120)
    and (preferred_channel is null or char_length(preferred_channel) <= 60)
    and (locale is null or char_length(locale) <= 10)
    and (source is null or char_length(source) <= 120)
    and (attachment_url is null or char_length(attachment_url) <= 2000)
  );

alter table public.payment_submissions
  add constraint payment_submissions_name_len check (client_name is null or char_length(client_name) <= 200),
  add constraint payment_submissions_email_len check (email is null or char_length(email) <= 320),
  add constraint payment_submissions_whatsapp_len check (whatsapp is null or char_length(whatsapp) <= 40),
  add constraint payment_submissions_meta_len check (
    (service_id is null or char_length(service_id) <= 120)
    and (service_title is null or char_length(service_title) <= 200)
    and (project_name is null or char_length(project_name) <= 200)
    and (amount is null or char_length(amount) <= 40)
    and (currency is null or char_length(currency) <= 10)
    and (method_id is null or char_length(method_id) <= 60)
    and (note is null or char_length(note) <= 2000)
    and (proof_path is null or char_length(proof_path) <= 500)
    and (proof_filename is null or char_length(proof_filename) <= 260)
    and (proof_type is null or char_length(proof_type) <= 120)
  ),
  add constraint payment_submissions_proof_size check (
    proof_size_bytes is null or (proof_size_bytes > 0 and proof_size_bytes <= 10485760)
  );