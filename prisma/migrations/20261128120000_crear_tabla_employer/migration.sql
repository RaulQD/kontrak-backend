-- US-031: datos del empleador, en una sola fila.
-- Reversión: DROP TABLE "employer";
CREATE TABLE "employer" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "ruc" CHAR(11) NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "legal_rep_name" VARCHAR(150) NOT NULL,
    "legal_rep_doc_type" "document_type" NOT NULL,
    "legal_rep_doc_number" VARCHAR(12) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employer_pkey" PRIMARY KEY ("id"),
    -- Una sola fila: la clave primaria solo puede valer 1.
    CONSTRAINT "employer_single_row" CHECK ("id" = 1)
);