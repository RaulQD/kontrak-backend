-- CreateTable
CREATE TABLE "legal_parameters" (
    "id" UUID NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "value" DECIMAL(14,6) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "valid_from" TIMESTAMPTZ(6) NOT NULL,
    "valid_to" TIMESTAMPTZ(6),
    "legal_reference" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_legal_parameters_code_vigencia" ON "legal_parameters"("code", "valid_from" DESC);

CREATE EXTENSION IF NOT EXISTS "btree_gist";

ALTER TABLE legal_parameters ADD CONSTRAINT ck_legal_parameters_valid_range CHECK (valid_to IS NULL OR valid_to > valid_from);

ALTER TABLE legal_parameters ADD CONSTRAINT ex_legal_parameters_no_overlap EXCLUDE USING gist (code WITH =, tstzrange(valid_from,valid_to,'[)') WITH &&);