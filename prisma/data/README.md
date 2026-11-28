# Datos versionados para el seed

## `DISTRITOS-INEI.csv`

Catálogo de distritos del Perú con su código de ubigeo del **INEI**. No son los códigos de RENIEC, que difieren en algunos distritos.

|            |                                                                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fuente     | INEI, _Directorio Nacional de Gobiernos Regionales, Municipalidades Provinciales y Distritales y de Centros Poblados 2026_. Carpeta `1.Directorio-MPyMD-2026` (26 archivos, uno por departamento; Lima va en dos: 15A Lima Metropolitana y 15B Departamento de Lima). Los archivos tienen fecha de marzo a mayo de 2026. |
| Dónde      | gob.pe → INEI → Informes y publicaciones                                                                                                                                                                                                                                                                                 |
| Descargado | 2026-11-27                                                                                                                                                                                                                                                                                                               |
| Contenido  | 1892 distritos, 196 provincias, 25 departamentos                                                                                                                                                                                                                                                                         |
| Columnas   | `id` (ubigeo de 6 dígitos), `department`, `province`, `district`                                                                                                                                                                                                                                                         |

**Cómo se generó.** De cada archivo se tomaron las filas cuyo ubigeo tiene 6 dígitos (las de 2 y 4 dígitos son los totales por departamento y provincia):

- El departamento sale de los dos primeros dígitos (tabla oficial 01 Amazonas … 25 Ucayali).
- La provincia sale de la fila de 4 dígitos. En Lima Metropolitana (1501) y Callao (0701) esa fila dice «Total», así que se usó el nombre del distrito capital.
- Los nombres van en mayúsculas, con tildes y ñ, sin espacios repetidos.
- Se quitó la llamada de nota «1/» de tres distritos: 130112 Alto Trujillo, 160405 Santa Rosa de Loreto y 060414 Pion. Esas notas hablan de su situación electoral, no del nombre.

**Para actualizarlo**, descarga el directorio del año nuevo, regenera el CSV con las mismas reglas y cambia `DISTRITOS_INEI_2026` en `prisma/seed-ubigeo.test.ts` si cambió el número de distritos. El seed actualiza los nombres que cambien y nunca borra un ubigeo, porque los colaboradores y las sedes lo referencian.
