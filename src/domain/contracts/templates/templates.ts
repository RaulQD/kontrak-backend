export const CONTRACT_PART_TIME = `
<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>{{dni}}</title>
        <style>
            body {
                font-family: 'Arial MT', sans-serif;
                font-size: 7pt;
                line-height: 1.3;
                text-align: justify;
                text-justify: inter-word;
                margin-left: 1.79cm;  /* Sangría Izquierda exacta de tu Word */
                margin-right: 1.58cm; /* Sangría Derecha exacta de tu Word */
            }
            .intro-paragraph {
                margin-bottom: 16px;  /* El espacio que ya tenías debajo */
            }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            
            /* Títulos de Cláusulas */
            .clause-title {
                font-size: 8pt; /* Ligeramente más grande para resaltar */
                font-weight: bold;
                text-decoration: underline;
                margin-top: 12px;
                display: block;
                text-align: left;
            }
            /* Estructura Flex para párrafos numerados (ej: 1.1 Texto) */
            .clause-row {
                display: flex;
            }
            .clause-num {
                min-width: 35px; /* Tu variable numberWidth */
                font-weight: normal;
            }
            .clause-text {
                width: 100%;
                text-align: justify;
            }
            /* Listas literales (a, b, c...) con indentación extra */
            .clause-list {
                display: flex;
                margin-left: 35px; /* Indentación extra */
            }
            .cl-bullet {
                min-width: 30px;
            }
            .bullet-row {
                margin-left: 30px;
            }
            /* Sección de Firmas */
            .signatures-wrapper {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start; /* Alinea al fondo */
                page-break-inside: avoid; /* Evita que las firmas se corten */
            }
            .signature-col {
                width: 31%; /* 3 columnas aprox */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-img {
                height: 50px;
                width: 85px;
                object-fit: contain;
                margin-bottom: 5px;
            }
            .signature-line {
                width: 100%;
                border-top: 1px solid #000;
                margin-bottom: 5px;
            }
            .signature-text {
                font-size: 8pt;
                width: 100%;
                text-align: left;
                line-height: 1.2;
            }
            
            /* Espaciadores */
            .mt-1 { margin-top: 1em; }
            .mb-1 { margin-bottom: 1em; }
        </style>
    </head>
    <body>

        <div class="text-center bold underline" style="font-size: 8pt; margin-bottom: 15px;">
            CONTRATO DE TRABAJO DE TIEMPO PARCIAL
        </div>

        <div class='intro-paragraph'>
            Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el <span class="bold">Contrato de Trabajo a Tiempo Parcial</span>, que, al amparo de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N’ 002-97-TR, celebran, de una parte, la empresa INVERSIONES URBANÍSTICAS OPERADORA S.A., con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662  y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará “EL EMPLEADOR”; y de otra parte, el Sr.(a). <span class="bold">{{fullName}}</span> identificado con <span class="bold">DNI N° {{dni}}</span>, de nacionalidad peruana, con domicilio en <span class="bold">{{address}}</span>, Distrito de <span class="bold">{{district}}</span>, Provincia de <span class="bold">{{province}}</span> y Departamento de <span class="bold">{{department}}</span> a quien en adelante se le denominará "EL TRABAJADOR"; en los términos y condiciones siguientes:
        </div>

        <div class="clause-title">PRIMERO: PARTES DEL CONTRATO</div>
        <div class="clause-row">
            <div class="clause-num">1.1</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR</span> es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">1.2</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR</span> para realizar actividades comerciales y de servicios en las distintas divisiones de negocios, requiere contar contratar personal que desempeñará labores a tiempo parcial.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">1.3</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara estar capacitado y no tener impedimento físico ni legal para desempeñar las funciones que le encomienda <span class="bold">EL EMPLEADOR</span> en el marco del presente <span class="bold">CONTRATO.</span>
            </div>
        </div>

        <div class="clause-title">SEGUNDA: OBJETO DEL CONTRATO</div>
        <div class="clause-row">
            <div class="clause-num">2.1</div>
            <div class="clause-text">
                Por el presente documento <span class="bold">EL EMPLEADOR</span> contrata a <span class="bold">EL TRABAJADOR</span> para que realice actividades de <span class="bold">{{position}}</span>, asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">2.2</div>
            <div class="clause-text">
                Las partes reconocen y declaran que el cargo de EL TRABAJADOR está sujeto a fiscalización inmediata.
            </div>
        </div>

        <div class="clause-title">TERCERO: PLAZO</div>
        <div class="clause-row">
            <div class="clause-num">3.1</div>
            <div class="clause-text">
                Atendiendo a las características propias del Contrato a Tiempo Parcial, <span class="bold">EL EMPLEADOR</span> contrata a <span class="bold">EL TRABAJADOR</span> por un plazo indeterminado.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">3.2</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR y/o EL TRABAJADOR</span> podrán dar por terminado el presente contrato, sin expresión de causa, bastando para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días calendarios.
            </div>
        </div>

        <div class="clause-title">CUARTO: JORNADA DE TRABAJO</div>
        <div class="clause-row">
            <div class="clause-num">4.1</div>
            <div class="clause-text">
                En relación a la Jornada de Trabajo, <span class="bold">EL EMPLEADOR y EL TRABAJADOR</span> acuerdan que <span class="bold">EL TRABAJADOR</span> cumplirá una jornada menor a cuatro (04) horas diarias en promedio a la semana, de conformidad con lo dispuesto en los artículos 11 y 12 del Decreto Supremo 001-96-TR, que aprueba el Reglamento de Ley de Fomento al Empleo, y las demás normas que regulan el contrato de trabajo a tiempo parcial.”
            </div>
        </div>

        <div class="clause-title">QUINTO: REMUNERACION</div>
        <div class="clause-row">
            <div class="clause-num">5.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> recibíra por la prestación integra y oportuna de sus servicios, una renumeración brutal mensual <span class="bold">S/ {{salary}} {{salaryInWords}}</span> más la asignación familiar correspondiente de ser el caso, de la cual se deducirán las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">5.2</div>
            <div class="clause-text">
                Adicionalmente, <span class="bold">EL TRABAJADOR</span> tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones, al convenio celebrado o a las que <span class="bold">EL EMPLEADOR,</span> a título de liberalidad, le otorgue.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">5.3</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara conocer que por sus horas de labor no le alcanza el derecho a la protección contra el despido arbitrario y a la compensación por tiempo de servicios.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">5.4</div>
            <div class="clause-text">
                Será de cargo de <span class="bold">EL TRABAJADOR</span> el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de Pensiones, las que en caso corresponda serán retenidas por <span class="bold">EL EMPLEADOR,</span> así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">5.5</div>
            <div class="clause-text">
                Ambas partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por <span class="bold">EL EMPLEADOR</span> de acuerdo con sus necesidades operativas
            </div>
        </div>

        <div class="clause-title" style="margin-bottom:0.75rem">SEXTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR</div>
        <div>
            Por medio del presente documento, <span class="bold">EL TRABAJADOR</span> se obliga, referencialmente a:
        </div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">6.1</div>
            <div class="clause-text">
                Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale <span class="bold">EL EMPLEADOR</span> o sus representantes, para realizar las actividades que correspondan a su cargo.
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">6.2</div>
            <div class="clause-text">
                La prestación laboral deberá ser efectuada de manera personal, no pudiendo <span class="bold">EL TRABAJADOR</span> ser reemplazado ni asistido por terceros, debiendo <span class="bold">EL TRABAJADOR</span> cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">6.3</div>
            <div class="clause-text">
                Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y experiencia profesional en el cumplimiento de los objetivos y estrategias de <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:78px">
            <div class="clause-num">6.4</div>
            <div class="clause-text">
                Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas, circulares, reglamentos, normas, etc., que expida <span class="bold">EL EMPLEADOR</span> declarando conocer todas aquellas que se encuentren vigentes.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">6.5</div>
            <div class="clause-text">
                No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro de <span class="bold">EL EMPLEADOR,</span> en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. <span class="bold">EL TRABAJADOR</span> declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">6.6</div>
            <div class="clause-text">
                Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">6.7</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que tiene establecido <span class="bold">EL EMPLEADOR,</span> con el objeto de valorar el nivel de eficiencia logrado por <span class="bold">EL TRABAJADOR</span> en su puesto de trabajo.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">6.8</div>
            <div class="clause-text">
                Cualquier otra obligación prevista en este contrato, establecida por <span class="bold">EL EMPLEADOR,</span> que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.
            </div>
        </div>

        <div class="clause-title">SÉTIMO: OBLIGACIONES DEL EMPLEADOR</div>
        <div class="clause-row">
            <div class="clause-num">7.1</div>
            <div class="clause-text">
                Pagar a <span class="bold">EL TRABAJADOR</span> todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">7.2</div>
            <div class="clause-text">
                Registrar los pagos realizados a <span class="bold">EL TRABAJADOR</span> en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">7.3</div>
            <div class="clause-text">
                Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">7.4</div>
            <div class="clause-text">
                Retener de la remuneración bruta mensual de <span class="bold">EL TRABAJADOR,</span> las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">7.5</div>
            <div class="clause-text">
                Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.
            </div>
        </div>

        <div class="clause-title">OCTAVO: DECLARACIONES DE LAS PARTES</div>
        <div>Las partes reconocen, acuerdan y declaran lo siguiente:</div>
        
        <div class="clause-row">
            <div class="clause-num">8.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">8.2</div>
            <div class="clause-text">
                De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, <span class="bold">EL EMPLEADOR</span> se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">8.3</div>
            <div class="clause-text">
                Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que <span class="bold">EL TRABAJADOR</span> prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">8.4</div>
            <div class="clause-text">
                Las partes convienen que <span class="bold">EL EMPLEADOR</span> tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de <span class="bold">EL TRABAJADOR.</span>
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">8.5</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR y EL EMPLEADOR</span> acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante (s) legal (es) de <span class="bold">EL EMPLEADOR</span> con firma (s) digitalizada (s), una vez que la (s) firma (s) sea (n) inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, <span class="bold">EL TRABAJADOR</span> presta su consentimiento expreso para que su (s) Boleta (s) de Pago sea (n) suscritas por el (los) representante (s) de <span class="bold">EL EMPLEADOR</span> a través de firma (s) digital (es), una vez que ello sea implementado por el Ministerio de Trabajo.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">8.6</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR y EL EMPLEADOR</span> acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente <span class="bold">EL EMPLEADOR</span> prestando <span class="bold">EL TRABAJADOR</span> su consentimiento expreso para ello. Asimismo, <span class="bold">EL TRABAJADOR</span> declara como su dirección electrónica <span class="bold">{{email}}</span> en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose <span class="bold">EL TRABAJADOR</span> a informar por escrito a <span class="bold">EL EMPLEADOR</span> cualquier cambio de su dirección electrónica.
            </div>
        </div>

        <div class="clause-title">NOVENO: TÉRMINO DEL CONTRATO</div>
        <div class="clause-row">
            <div class="clause-num">9.1</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR y/o EL TRABAJADOR,</span> según corresponda podrán dar por terminado el presente contrato, sin expresión de causa, bastando para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días calendarios.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">9.2</div>
            <div class="clause-text">
                Además, son causales de resolución del presente contrato las siguientes:
            </div>
        </div>
        
        <div class="clause-list">
            <div class="cl-bullet">a)</div>
            <div class="clause-text">La voluntad concertada de las partes</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">b)</div>
            <div class="clause-text">El incumplimiento de las obligaciones estipuladas en el presente documento.</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">c)</div>
            <div class="clause-text">La comisión de falta grave por parte de <span class="bold">EL TRABAJADOR</span> prevista en las normas que resulten aplicables.</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">d)</div>
            <div class="clause-text">Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.</div>
        </div>

        <div class="clause-title">DÉCIMO: PROPIEDAD INTELECTUAL</div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">10.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> cede y transfiere a <span class="bold">EL EMPLEADOR</span> en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando <span class="bold">EL TRABAJADOR</span> facultado para publicar o reproducir en forma íntegra o parcial dicha información.
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">10.2</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> en virtud del presente contrato laboral, cede en exclusiva a <span class="bold">EL EMPLEADOR</span> todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:10px">
            <div class="clause-num">10.3</div>
            <div class="clause-text">
                Por lo tanto, toda información creada u originada es de propiedad exclusiva de <span class="bold">EL EMPLEADOR,</span> quedando <span class="bold">EL TRABAJADOR</span> prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de <span class="bold">EL EMPLEADOR.</span> Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.
            </div>
        </div>
        <div class="clause-row" style="margin-bottom:20px">
            <div class="clause-num">10.4</div>
            <div class="clause-text">
                En ese sentido, <span class="bold">EL TRABAJADOR</span> acepta que <span class="bold">EL EMPLEADOR</span> tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por <span class="bold">EL EMPLEADOR a EL TRABAJADOR</span> para el cumplimiento de sus funciones.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">10.5</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO PRIMERO: USO DE CORREO ELECTRÓNICO</div>
        <div class="clause-row">
            <div class="clause-num">11.1</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR</span> facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio que pueda crear a futuro.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">11.2</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. <span class="bold">EL TRABAJADOR</span> reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">11.3</div>
            <div class="clause-text">
                En ese sentido, <span class="bold">EL TRABAJADOR</span> acepta que <span class="bold">LA EMPRESA</span> tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a <span class="bold">EL TRABAJADOR</span> copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.
            </div>
        </div>

        <div class="clause-title">DÉCIMO SEGUNDA: EXCLUSIVIDAD</div>
        <div class="clause-row">
            <div class="clause-num">12.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> es contratado de forma exclusiva por <span class="bold">EL EMPLEADOR,</span> por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>

        <div class="clause-title">DÉCIMO TERCERA: NO COMPETENCIA</div>
        <div class="clause-row">
            <div class="clause-num">13.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se compromete a no competir con <span class="bold">EL EMPLEADOR,</span> en los términos y condiciones que se acuerdan a continuación:
            </div>
        </div>
        
        <div class="clause-list">
            <div class="cl-bullet">a.</div>
            <div class="clause-text">A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">b.</div>
            <div class="clause-text">A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">c.</div>
            <div class="clause-text">A no utilizar la información de carácter reservado que le fue proporcionada por <span class="bold">EL EMPLEADOR</span> para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">d.</div>
            <div class="clause-text">A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de <span class="bold">EL EMPLEADOR</span> a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para <span class="bold">EL TRABAJADOR</span> o para cualquier otra persona, entidad, institución o empresa, que compita con <span class="bold">EL EMPLEADOR.</span></div>
        </div>

        <div class="clause-row">
            <div class="clause-num">13.2</div>
            <div class="clause-text">
                Las obligaciones que <span class="bold">EL TRABAJADOR</span> asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">13.3</div>
            <div class="clause-text">
                El incumplimiento por parte de <span class="bold">EL TRABAJADOR</span> de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR</span> a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">13.4</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO CUARTO: RESERVA Y CONFIDENCIALIDAD</div>
        <div class="clause-row">
            <div class="clause-num">14.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para <span class="bold">EL EMPLEADOR,</span> en los términos y condiciones que se acuerdan a continuación:
            </div>
        </div>

        <div class="clause-list">
            <div class="cl-bullet">a.</div>
            <div class="clause-text">A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre <span class="bold">EL EMPLEADOR</span> y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">b.</div>
            <div class="clause-text">A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a <span class="bold">EL EMPLEADOR</span> de cualquier naturaleza.</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">c.</div>
            <div class="clause-text">A no revelar a ninguna persona que preste servicios a <span class="bold">EL EMPLEADOR,</span> ningún tipo de información confidencial o de propiedad de <span class="bold">EL EMPLEADOR,</span> salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, <span class="bold">EL TRABAJADOR,</span> se obliga a solicitar autorización de sus superiores.</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">d.</div>
            <div class="clause-text">A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por <span class="bold">EL EMPLEADOR,</span> así como a no introducir en las instalaciones de <span class="bold">EL EMPLEADOR,</span> ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. <span class="bold">EL TRABAJADOR</span> se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas.</div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">e.</div>
            <div class="clause-text">A devolver a <span class="bold">EL EMPLEADOR,</span> al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado.</div>
        </div>

        <div class="clause-row">
            <div class="clause-num">14.2</div>
            <div class="clause-text">
                Las obligaciones que <span class="bold">EL TRABAJADOR</span> asume en los literales a), b), c), d) y e) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">14.3</div>
            <div class="clause-text">
                El incumplimiento por parte de <span class="bold">EL TRABAJADOR</span> de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR</span> a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">14.4</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO QUINTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES</div>
        <div class="clause-row" style="margin-bottom:16px;">
            <div class="clause-num">15.1</div>
            <div class="clause-text">
                En caso <span class="bold">EL TRABAJADOR</span> accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span> referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.
                <br><br>
                En cualquier caso, corresponde a <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span> decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose <span class="bold">EL TRABAJADOR</span> a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span>
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">15.2</div>
            <div class="clause-text" style="margin-bottom:16px;>
                De esta forma, <span class="bold">EL TRABAJADOR</span> queda obligado a:
            </div>
        </div>

        <div class="clause-list">
            <div class="cl-bullet">a.</div>
            <div class="clause-text">Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">b.</div>
            <div class="clause-text">Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
        </div>
        <div class="clause-list">
            <div class="cl-bullet">c.</div>
            <div class="clause-text">Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.</div>
        </div>

        <div class="clause-row" style="margin-top:16px;">
            <div class="clause-num">15.3</div>
            <div class="clause-text">
                El incumplimiento de <span class="bold">EL TRABAJADOR</span> respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.
            </div>
        </div>

        <div class="clause-title">DÉCIMO SEXTA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS</div>
        <div class="clause-row">
            <div class="clause-num">16.1</div>
            <div class="clause-text">
                Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general, incluyendo reglamentos, directivas, regulaciones, jurisprudencia vinculante, decisiones, decretos, órdenes, instrumentos y cualquier otra medida legislativa o decisión con fuerza de ley en el Perú de obligatorio cumplimiento para el EMPLEADOR o el TRABAJADOR o cualquiera de ellas.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">16.2</div>
            <div class="clause-text">
                El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental o a cualquier persona que busque el beneficio de un funcionario gubernamental. Asimismo, declara que no ha sido sancionado ni investigado por la comisión de los delitos de lavado de activos, financiamiento del terrorismo, corrupción de funcionarios, apropiación ilícita, fraude financiero, defraudación tributaria. El TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">16.3</div>
            <div class="clause-text">
               <p style="margin-bottom:10px;">
                Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.
                Al respecto, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza, para sí o para un tercero para realizar u omitir un acto que permita favorecer a otro en la adquisición o comercialización de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir un acto que permita favorecer a éste u otro en la adquisición o comercialización de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR.
                </p>
                <p>
                Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza para sí o para un tercero para realizar u omitir un acto en perjuicio de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir un acto en perjuicio de su EMPLEADOR.
                </p>

            </div>
        </div>
        <div class="clause-row"">
            <div class="clause-num">16.4</div>
            <div class="clause-text">
                Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">16.5</div>
            <div class="clause-text">
                Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las siguientes leyes:
            </div>
        </div>
        <ul class='bullet-row' style="margin-bottom:80px">
            <li>DL N°1106: Lavado de Activos</li>
            <li>Ley N°25475: Terrorismo</li>
            <li>Código Penal Peruano: Fraude en las Personas Jurídicas</li>
            <li>Código Penal Peruano: Delitos Contra El Patrimonio Cultural</li>
            <li>Decreto Legislativo N°813: Ley Penal Tributaria</li>
            <li>Ley N°28008: Delitos Aduaneros</li>
        </ul>
        <div class="clause-title">DÉCIMO SETIMA: VALIDEZ</div>
        <div class="clause-row">
            <div class="clause-num">17.1</div>
            <div class="clause-text">
                Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.
            </div>
        </div>

        <div class="clause-title">DÉCIMO OCTAVA: DE LOS EXÁMENES MÉDICOS</div>
        <div class="clause-row">
            <div class="clause-num">18.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se someterá obligatoriamente a los exámenes médicos que dispongan <span class="bold">EL EMPLEADOR</span> y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.
            </div>
        </div>

        <div class="clause-title">DÉCIMO NOVENA: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO</div>
        <div class="clause-row">
            <div class="clause-num">19.1</div>
            <div class="clause-text">
                De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato <span class="bold">(ANEXO – 1),</span> se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que <span class="bold">EL TRABAJADOR</span> deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.
            </div>
        </div>

        <div class="clause-title">VIGÉSIMA: DOMICILIO</div>
        <div class="clause-row">
            <div class="clause-num">18.1</div>
            <div class="clause-text">
                Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">18.2</div>
            <div class="clause-text">
                Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.
            </div>
        </div>

        <div class="clause-title">VIGÉSIMA PRIMERA: SOLUCIÓN DE DISPUTAS</div>
        <div class="clause-row">
            <div class="clause-num">19.1</div>
            <div class="clause-text">
                En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus esfuerzos con el fin de lograr una solución armoniosa a sus diferencias.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">19.2</div>
            <div class="clause-text">
                Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.
            </div>
        </div>

        <div class="clause-title">VIGÉSIMA SEGUNDA: APLICACIÓN SUPLETORIA</div>
        <div class="text-justify mb-1">
            En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.
        </div>

        <div class="text-justify" style="margin-top: 30px;">
            En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de {{province}}, el día {{entryDate}}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.
        </div>

        <div class="signatures-wrapper">
            <div class="signature-col">
                {{#if signature1}}
                    <img src="{{signature1}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer1Name}}</div>
                <div class="signature-text">DNI N°: {{signer1DNI}}</div>
            </div>

            <div class="signature-col">
                {{#if signature2}}
                    <img src="{{signature2}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer2Name}}</div>
                <div class="signature-text">DNI N°: {{signer2DNI}}</div>
            </div>

            <div class="signature-col">
                <div style="height: 55px;"></div> <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL TRABAJADOR</div>
                <div class="signature-text">NOMBRE: {{fullName}}</div>
                <div class="signature-text">DNI: {{dni}}</div>
                <div class="signature-text">DIVISIÓN: {{subDivision}}</div>
            </div>
        </div>

    </body>
    </html>
    `;
export const CONTRACT_FULL_TIME = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>{{dni}}</title>
        <style>
            body {
                font-family: 'Arial MT', sans-serif;
                font-size: 7pt;
                line-height: 1.3;
                text-align: justify;
                text-justify: inter-word;
                margin-left: 1.49cm;  /* Sangría Izquierda exacta de tu Word */
                margin-right: 0.98cm; /* Sangría Derecha exacta de tu Word */
            }
            .intro-paragraph {
                margin-bottom: 16px;  /* El espacio que ya tenías debajo */
            }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            
            /* Títulos de las cláusulas */
            .clause-title {
                font-size: 7pt; /* Ligeramente más grande para resaltar */
                font-weight: bold;
                text-decoration: underline;
                margin-top: 12px;
                display: block;
                text-align: left;
            }

            /* Estructura Flex para párrafos numerados (ej: 1.1 Texto) */
            .clause-row {
                display: flex;
            }
            .clause-num {
                min-width: 35px; /* Tu variable numberWidth */
                font-weight: normal;
            }
            .clause-text {
                width: 100%;
                text-align: justify;
            }

            /* Listas indentadas (a, b, c) */
            .list-row {
                display: flex;
                margin-left: 35px; /* Indentación extra */
            }
            .list-bullet {
                min-width: 30px;
            }
            
            /* Listas de leyes (bullets) */
            .bullet-row {
                margin-left: 30px;
            }

           /* Sección de Firmas */
            .signatures-wrapper {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start; /* Alinea al fondo */
                page-break-inside: avoid; /* Evita que las firmas se corten */
            }
            .signature-col {
                width: 31%; /* 3 columnas aprox */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-img {
                height: 50px;
                width: 85px;
                object-fit: contain;
                margin-bottom: 5px;
            }
            .signature-line {
                width: 100%;
                border-top: 1px solid #000;
                margin-bottom: 5px;
            }
            .signature-text {
                font-size: 8pt;
                width: 100%;
                text-align: left;
                line-height: 1.2;
            }
        </style>
    </head>
    <body>

        <div class="text-center bold underline" style="font-size: 7pt; margin-bottom: 15px;">
            CONTRATO DE TRABAJO A PLAZO FIJO POR INCREMENTO DE ACTIVIDADES
        </div>

        <div class="intro-paragraph">
            Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, Contrato por Incremento de Actividades que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97- TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span>, con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662 y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará "EL EMPLEADOR"; y de otra parte, el Sr.(a). <span class="bold">{{fullName}}</span> identificado con <span class="bold">DNI N° {{dni}}</span>, de nacionalidad peruana, con domicilio en <span class="bold">{{address}}</span>, Distrito de <span class="bold">{{district}}</span>, Provincia de <span class="bold">{{province}}</span> y Departamento de <span class="bold">{{department}}</span> fijando como correo electrónico personal <span class="bold">{{email}}</span> a quien en adelante se le denominará "EL TRABAJADOR"; en los términos y condiciones siguientes:
        </div>

        <div class="clause-title">PRIMERO: PARTES DEL CONTRATO</div>
        
        <div class="clause-row">
            <div class="clause-num">1.1</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR</span> es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">1.2</div>
            <div class="clause-text">
                En ese contexto, <span class="bold">EL EMPLEADOR</span> ha asumido la administración de una serie de playas de estacionamiento en la ciudad de Lima y provincias, así como la implementación de negocios colaterales en las playas de estacionamiento que ya vienen siendo administradas, situación que generará un incremento considerable de sus actividades – directa o indirectamente vinculadas al giro del negocio de estacionamientos, con la consecuente necesidad de contratar personal para concretar sus operaciones en las referidas playas de estacionamiento, siendo que las áreas involucradas son <span class="bold">{{division}}</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">1.3</div>
            <div class="clause-text">
                Conforme lo detalla el correspondiente Informe del Área de Operaciones, el incremento en sus operaciones relacionadas a la administración de playas de estacionamiento es de tal magnitud que no puede ser satisfecho con su personal actual, motivo por el cual requiere contratar a plazo fijo a una persona que tenga la experiencia necesaria para desempeñarse como <span class="bold">{{position}}.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">1.4</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> declara tener experiencia como <span class="bold">{{position}},</span> por lo que cuenta con las condiciones necesarias para ocupar el cargo de <span class="bold">{{position}},</span> durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.
            </div>
        </div>

        <div class="clause-title">SEGUNDO: OBJETO DEL CONTRATO</div>

        <div class="clause-row">
            <div class="clause-num">2.1</div>
            <div class="clause-text">
                Por el presente documento <span class="bold">EL EMPLEADOR</span> contrata a plazo fijo a <span class="bold">EL TRABAJADOR</span> bajo la modalidad de <span class="bold">INCREMENTO DE ACTIVIDADES</span> para que ocupe el cargo de <span class="bold">{{position}}</span> asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">2.2</div>
            <div class="clause-text">
                Las partes reconocen y declaran que el cargo de <span class="bold">EL TRABAJADOR</span> está <span class="bold">{{workingCondition}}</span> de acuerdo a lo establecido en el artículo 43 del Decreto Supremo Nro. 003-97-TR.
            </div>
        </div>

        <div class="clause-title">TERCERO: PLAZO</div>

        <div class="clause-row">
            <div class="clause-num">3.1</div>
            <div class="clause-text">
                Las labores que desarrollará <span class="bold">EL TRABAJADOR</span> tendrán una duración de , los cuales se contabilizarán desde el día <span class="bold">{{entryDate}}</span> y concluirán el día <span class="bold">{{endDate}}.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">3.2</div>
            <div class="clause-text">
                Las partes acuerdan que dado que el cargo que desempeñará <span class="bold">EL TRABAJADOR</span> corresponde a uno <span class="bold">{{workingCondition}}</span>.
            </div>
        </div>

        <div class="clause-title">CUARTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR</div>
        <div style="margin-bottom: 10px;">
            Por medio del presente documento, <span class="bold">EL TRABAJADOR</span> se obliga, referencialmente, a:
        </div>

        <div class="clause-row">
            <div class="clause-num">4.1</div>
            <div class="clause-text">
                Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale <span class="bold">EL EMPLEADOR</span> o sus representantes, para realizar las actividades que correspondan a su cargo.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.2</div>
            <div class="clause-text">
                La prestación laboral deberá ser efectuada de manera personal, no pudiendo <span class="bold">EL TRABAJADOR</span> ser reemplazado ni asistido por terceros, debiendo <span class="bold">EL TRABAJADOR</span> cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.3</div>
            <div class="clause-text">
                Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y profesional en el cumplimiento de los objetivos y estrategias de <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.4</div>
            <div class="clause-text">
                Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas circulares, reglamentos, normas, etc., que expida <span class="bold">EL EMPLEADOR;</span> declarando conocer todas aquellas que se encuentren vigentes.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.5</div>
            <div class="clause-text">
                No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro de giro de <span class="bold">EL EMPLEADOR,</span> en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. <span class="bold">EL TRABAJADOR</span> declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.6</div>
            <div class="clause-text">
                Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.7</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que tiene establecidos <span class="bold">EL EMPLEADOR,</span> con el objeto de valorar el nivel de eficiencia logrado por <span class="bold">EL TRABAJADOR</span> en su puesto de trabajo.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.8</div>
            <div class="clause-text">
                Cualquier otra obligación prevista en este contrato, establecida por <span class="bold">EL EMPLEADOR,</span> que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.9</div>
            <div class="clause-text">
                En caso sea necesario para el cumplimiento de sus labores, <span class="bold">EL TRABAJADOR,</span> deberá trasladarse a las operaciones y/o plazas en los que <span class="bold">EL EMPLEADOR</span> realiza actividades comerciales.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">4.10</div>
            <div class="clause-text">
                En caso <span class="bold">EL TRABAJADOR</span> no cumpla con observar el plazo de preaviso legal de renuncia de treinta (30) días, deberá abonar a favor de <span class="bold">EL EMPLEADOR</span> una penalidad a modo de indemnización equivalente a la remuneración diaria que percibe <span class="bold">EL TRABAJADOR</span> por cada día que no preste servicios en desconocimiento de dicho preaviso, para lo cual <span class="bold">EL TRABAJADOR</span> autoriza a <span class="bold">EL EMPLEADOR</span> a que se le descuente el monto que corresponda de su liquidación de beneficios sociales.
            </div>
        </div>

        <div class="clause-title">QUINTO: PERÍODO DE PRUEBA</div>
        
        <div class="clause-row" style="margin-bottom:40px;">
            <div class="clause-num">5.1</div>
            <div class="clause-text">
                Ambas partes acuerdan en pactar un período de prueba de <span class="bold">{{probationaryPeriod}}</span> de acuerdo con lo que establece el artículo 10 de la Ley de Productividad y Competitividad Laboral.
            </div>
        </div>

        <div class="clause-title">SEXTO: REMUNERACION</div>

        <div class="clause-row">
            <div class="clause-num">6.1</div>
            <div class="clause-text">
                Las partes dejan expresa constancia que la retribución que perciba <span class="bold">EL EMPLEADOR</span> estará compuesta por una remuneración fija Mensual ascendente al monto bruto de <span class="bold">S/ {{salary}} {{salaryInWords}}.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">6.2</div>
            <div class="clause-text">
                Asimismo, <span class="bold">EL TRABAJADOR</span> podrá percibir una remuneración variable sobre la base de condiciones de venta y/o en función al cumplimiento de indicadores de gestión y resultados, bajo los términos y condiciones establecidos en las políticas que determine <span class="bold">EL EMPLEADOR</span> de forma unilateral, las mismas que podrán ser modificadas o suprimidas en cualquier momento y a sola decisión de <span class="bold">EL EMPLEADOR,</span> lo cual es aceptado por <span class="bold">EL TRABAJADOR.</span> El pago de dicha remuneración variable se encuentra sujeto a la vigencia de la relación laboral, es decir, sólo se abonarán las comisiones a los trabajadores con vínculo laboral vigente a la fecha de pago de las mismas.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">6.3</div>
            <div class="clause-text">
                A la remuneración mensual de <span class="bold">EL TRABAJADOR</span> se agregará la Asignación Familiar correspondiente de ser el caso, deduciéndose las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">6.4</div>
            <div class="clause-text">
                Adicionalmente, <span class="bold">EL TRABAJADOR</span> tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">6.5</div>
            <div class="clause-text">
                Será de cargo de <span class="bold">EL TRABAJADOR</span> el pago del Impuesto a la Renta y los aportes al Sistema Nacional o Privado de Pensiones, los que serán retenidos por <span class="bold">EL EMPLEADOR</span> así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">6.6</div>
            <div class="clause-text">
                Ambas partes acuerdan que la forma y fecha de pago de la remuneración será determinada por <span class="bold">EL EMPLEADOR</span> y podrá ser modificada de acuerdo con sus necesidades operativas.
            </div>
        </div>

        <div class="clause-title">SÉTIMO: OBLIGACIONES DEL EMPLEADOR</div>

        <div class="clause-row">
            <div class="clause-num">7.1</div>
            <div class="clause-text">
                Pagar a <span class="bold">EL TRABAJADOR</span> todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago. Registrar los pagos realizados a <span class="bold">EL TRABAJADOR</span> en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">7.2</div>
            <div class="clause-text">
                Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">7.3</div>
            <div class="clause-text">
                Retener de la remuneración bruta mensual de <span class="bold">EL TRABAJADOR,</span> las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">7.4</div>
            <div class="clause-text">
                Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.
            </div>
        </div>

        <div class="clause-title">OCTAVO: JORNADA DE TRABAJO</div>
        <div style="margin-bottom: 6px;>
            En relación a la Jornada de Trabajo, <span class="bold">EL EMPLEADOR y EL TRABAJADOR</span> acuerdan lo siguiente:
        </div>

        <div class="clause-row">
            <div class="clause-num">8.1</div>
            <div class="clause-text">
                La jornada de trabajo es de 48 horas semanales flexible, teniendo <span class="bold">EL EMPLEADOR</span> la facultad de establecer el horario de trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.2</div>
            <div class="clause-text">
                El tiempo de Refrigerio no forma parte de la jornada de trabajo.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.3</div>
            <div class="clause-text">
                Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán compensar con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas semanales en promedio. Asimismo, acuerdan que <span class="bold">EL EMPLEADOR</span> podrá introducir modificaciones al horario y jornada de trabajo, establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados, respetando la jornada máxima establecida por Ley.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.4</div>
            <div class="clause-text">
                El trabajo en sobretiempo de <span class="bold">EL TRABAJADOR</span> es estrictamente voluntario y, a solicitud de <span class="bold">EL EMPLEADOR</span> debiendo <span class="bold">EL TRABAJADOR</span> contar con autorización escrita de <span class="bold">EL EMPLEADOR</span> para realizar horas extras, según lo establecido en el Reglamento Interno de Trabajo. El trabajo en sobretiempo debe ser prestado de manera efectiva, no considerándose como tal la sola permanencia en las instalaciones de <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.5</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR y EL EMPLEADOR</span> acuerdan que durante la vigencia de la relación laboral podrán compensar el trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto en contrario.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.6</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> por su cargo y la naturaleza de su prestación de servicios se encuentra <span class="bold">{{workingCondition}}</span>.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">8.7</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> declara conocer que, debido al objeto social de la empresa, cuando ésta lo requiera y siempre y cuando le avise con un mínimo de 48 horas de anticipación, el trabajador deberá cumplir con laborar en días feriados o no laborables, sin perjuicio de la compensación o pago de la sobretasa a la que tenga derecho.
            </div>
        </div>

        <div class="clause-title">NOVENO: DECLARACIONES DE LAS PARTES</div>
        <div>
            Las partes reconocen, acuerdan y declaran lo siguiente:
        </div>

        <div class="clause-row">
            <div class="clause-num">9.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">9.2</div>
            <div class="clause-text">
                De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, <span class="bold">EL EMPLEADOR,</span> se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">9.3</div>
            <div class="clause-text">
                Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que <span class="bold">EL TRABAJADOR</span> prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">9.4</div>
            <div class="clause-text">
                Las partes convienen que <span class="bold">EL EMPLEADOR</span> tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de <span class="bold">EL TRABAJADOR.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">9.5</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR y EL EMPLEADOR</span> acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante(s) legal(es) de <span class="bold">EL EMPLEADOR</span> con firma(s) digitalizada(s), una vez que la(s) firma(s) sea(n) inscrita(s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, <span class="bold">EL TRABAJADOR</span> presta su consentimiento expreso para que su(s) Boleta(s) de Pago sea(n) suscritas por el (los) representante(s) de <span class="bold">EL EMPLEADOR</span> a través de firma(s) digital(es), una vez que ello sea implementado por el Ministerio de Trabajo.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">9.6</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR y EL EMPLEADOR</span> acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente <span class="bold">EL EMPLEADOR,</span> o el correo electrónico personal de <span class="bold">EL TRABAJADOR,</span> indicado en el exordio del presente contrato de trabajo, prestando <span class="bold">EL TRABAJADOR</span> su consentimiento expreso para ello. Asimismo, <span class="bold">EL TRABAJADOR,</span> declara como su dirección electrónico <span class="bold">{{email}},</span> en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose <span class="bold">EL TRABAJADOR,</span> a informar por escrito a <span class="bold">EL EMPLEADOR,</span> cualquier cambio de su dirección electrónica.
            </div>
        </div>

        <div class="clause-title">DÉCIMO: TÉRMINO DEL CONTRATO</div>

        <div class="clause-row">
            <div class="clause-num">10.1</div>
            <div class="clause-text">
                Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista en la cláusula tercera, salvo que las necesidades operativas exijan lo contrario, escenario en el que <span class="bold">EL EMPLEADOR,</span> propondrá a <span class="bold">EL TRABAJADOR,</span> suscribir una renovación por escrito. Por lo tanto, <span class="bold">EL EMPLEADOR,</span> no está obligado a dar ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a <span class="bold">EL TRABAJADOR</span> los beneficios sociales que le pudieran corresponder de acuerdo a ley. <span class="bold">EL EMPLEADOR</span> podrá resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo Nº 728, Decreto Supremo Nº 003-97-TR.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">10.2</div>
            <div class="clause-text">
                Además, son causales de resolución del presente contrato las siguientes:
            </div>
        </div>

        <div class="list-row">
            <div class="list-bullet">a)</div>
            <div class="clause-text">La voluntad concertada de las partes</div>
        </div>
        <div class="list-row">
            <div class="list-bullet">b)</div>
            <div class="clause-text">El incumplimiento de las obligaciones estipuladas en el presente documento.</div>
        </div>
        <div class="list-row">
            <div class="list-bullet">c)</div>
            <div class="clause-text">La comisión de falta grave por parte de <span class="bold">EL TRABAJADOR</span> prevista en las normas que resulten aplicables.</div>
        </div>
        <div class="list-row">
            <div class="list-bullet">d)</div>
            <div class="clause-text">Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.</div>
        </div>

        <div class="clause-title">DÉCIMO PRIMERA: PROPIEDAD INTELECTUAL</div>

        <div class="clause-row">
            <div class="clause-num">11.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> cede y transfiere a <span class="bold">EL EMPLEADOR</span> en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando <span class="bold">EL TRABAJADOR</span> facultado para publicar o reproducir en forma íntegra o parcial dicha información.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">11.2</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> en virtud del presente contrato laboral, cede en exclusiva a <span class="bold">EL EMPLEADOR</span> todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">11.3</div>
            <div class="clause-text">
                Por lo tanto, toda información creada u originada es de propiedad exclusiva de <span class="bold">EL EMPLEADOR,</span> quedando <span class="bold">EL TRABAJADOR</span> prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de <span class="bold">EL EMPLEADOR.</span> Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">11.4</div>
            <div class="clause-text">
                En ese sentido, <span class="bold">EL TRABAJADOR</span> acepta que <span class="bold">EL EMPLEADOR</span> tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por <span class="bold">EL EMPLEADOR a EL TRABAJADOR</span> para el cumplimiento de sus funciones.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">11.5</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR,</span> declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO</div>

        <div class="clause-row">
            <div class="clause-num">12.1</div>
            <div class="clause-text">
                <span class="bold">EL EMPLEADOR</span> facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A</span> que pueda crear a futuro.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">12.2</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. <span class="bold">EL TRABAJADOR</span> reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">12.3</div>
            <div class="clause-text">
                En ese sentido, <span class="bold">EL TRABAJADOR</span> acepta que <span class="bold">LA EMPRESA</span> tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a <span class="bold">EL TRABAJADOR</span> copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.
            </div>
        </div>

        <div class="clause-title">DÉCIMO TERCERA: EXCLUSIVIDAD</div>

        <div class="clause-row">
            <div class="clause-num">13.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> es contratado de forma exclusiva por <span class="bold">EL EMPLEADOR,</span> por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de <span class="bold">EL EMPLEADOR.</span>
            </div>
        </div>

        <div class="clause-title">DÉCIMO CUARTA: NO COMPETENCIA</div>

        <div class="clause-row">
            <div class="clause-num">14.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se compromete a no competir con <span class="bold">EL EMPLEADOR,</span> en los términos y condiciones que se acuerdan a continuación:
            </div>
        </div>

        <div class="list-row">
            <div class="list-bullet">a)</div>
            <div class="clause-text">A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">b)</div>
            <div class="clause-text">A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">c)</div>
            <div class="clause-text">A no utilizar la información de carácter reservado que le fue proporcionada por <span class="bold">EL EMPLEADOR</span> para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">d)</div>
            <div class="clause-text">A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de <span class="bold">EL EMPLEADOR</span> a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para <span class="bold">EL TRABAJADOR</span> o para cualquier otra persona, entidad, institución o empresa, que compita con <span class="bold">EL EMPLEADOR.</span></div>
        </div>

        <div class="clause-row">
            <div class="clause-num">14.2</div>
            <div class="clause-text">
                Las obligaciones que <span class="bold">EL TRABAJADOR</span> asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">14.3</div>
            <div class="clause-text">
                El incumplimiento por parte de <span class="bold">EL TRABAJADOR</span> de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR</span> a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">14.4</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO QUINTA: RESERVA Y CONFIDENCIALIDAD</div>

        <div class="clause-row">
            <div class="clause-num">15.1</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para <span class="bold">EL EMPLEADOR,</span> en los términos y condiciones que se acuerdan a continuación:
            </div>
        </div>

        <div class="list-row">
            <div class="list-bullet">a)</div>
            <div class="clause-text">A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre <span class="bold">EL EMPLEADOR</span> y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para <span class="bold">EL EMPLEADOR.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">b)</div>
            <div class="clause-text">A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a <span class="bold">EL EMPLEADOR</span> de cualquier naturaleza.</div>
        </div>
        <div class="list-row">
            <div class="list-bullet">c)</div>
            <div class="clause-text">A no revelar a ninguna persona que preste servicios a <span class="bold">EL EMPLEADOR,</span> ningún tipo de información confidencial o de propiedad de <span class="bold">EL EMPLEADOR,</span> salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, <span class="bold">EL TRABAJADOR,</span> se obliga a solicitar autorización de sus superiores.</div>
        </div>
        <div class="list-row" style="margin-top:40px">
            <div class="list-bullet">d)</div>
            <div class="clause-text">A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por <span class="bold">EL EMPLEADOR,</span> así como a no introducir en las instalaciones de <span class="bold">EL EMPLEADOR,</span> ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. <span class="bold">EL TRABAJADOR</span> se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas.</div>
        </div>
        <div class="list-row">
            <div class="list-bullet">e)</div>
            <div class="clause-text">A devolver a <span class="bold">EL EMPLEADOR,</span> al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado.</div>
        </div>

        <div class="clause-row">
            <div class="clause-num">15.2</div>
            <div class="clause-text">
                Las obligaciones que <span class="bold">EL TRABAJADOR</span> asume en los literales a), b), c), d) y e) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">15.3</div>
            <div class="clause-text">
                El incumplimiento por parte de <span class="bold">EL TRABAJADOR</span> de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR</span> a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">15.4</div>
            <div class="clause-text">
                <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
            </div>
        </div>

        <div class="clause-title">DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES</div>

        <div class="clause-row">
            <div class="clause-num">16.1</div>
            <div class="clause-text">
                En caso <span class="bold">EL TRABAJADOR</span> accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span> referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.
                En cualquier caso, corresponde a <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span> decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose <span class="bold">EL TRABAJADOR</span> a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span>
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">16.2</div>
            <div class="clause-text">
                De esta forma, <span class="bold">EL TRABAJADOR</span> queda obligado a:
            </div>
        </div>

        <div class="list-row">
            <div class="list-bullet">a)</div>
            <div class="clause-text">Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">b)</div>
            <div class="clause-text">Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
        </div>
        <div class="list-row">
            <div class="list-bullet">c)</div>
            <div class="clause-text">Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.</div>
        </div>

        <div class="clause-row">
            <div class="clause-num">16.3</div>
            <div class="clause-text">
                El incumplimiento de <span class="bold">EL TRABAJADOR</span> respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.
            </div>
        </div>

        <div class="clause-title">DÉCIMO SETIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS</div>

        <div class="clause-row">
            <div class="clause-num">17.1</div>
            <div class="clause-text">
                Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general, incluyendo reglamentos, directivas, regulaciones, jurisprudencia vinculante, decisiones, decretos, órdenes, instrumentos y cualquier otra medida legislativa o decisión con fuerza de ley en el Perú de obligatorio cumplimiento para el EMPLEADOR o el TRABAJADOR o cualquiera de ellas.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">17.2</div>
            <div class="clause-text">
                El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental o a cualquier persona que busque el beneficio de un funcionario gubernamental. Asimismo, declara que no ha sido sancionado ni investigado por la comisión de los delitos de lavado de activos, financiamiento del terrorismo, corrupción de funcionarios, apropiación ilícita, fraude financiero, defraudación tributaria. EL TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">17.3</div>
            <div class="clause-text">
                Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.
                Al respecto, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza, para sí o para un tercero para realizar u omitir un acto que permita favorecer a otro en la adquisición o comercialización de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir un acto que permita favorecer a éste u otro en la comercialización o adquisición de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR.
                <div style="margin-top:8rem">
                    Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza para sí o para un tercero para realizar u omitir un acto en perjuicio de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir realizar u omitir un acto en perjuicio de su EMPLEADOR.
                </div>
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">17.4</div>
            <div class="clause-text">
                Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.
            </div>
        </div>

        <div class="clause-row">
            <div class="clause-num">17.5</div>
            <div class="clause-text">
                Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las siguientes leyes:
            </div>
        </div>
        <ul class='bullet-row'>
            <li>DL N°1106: Lavado de Activos</li>
            <li>Ley N°25475: Terrorismo</li>
            <li>Código Penal Peruano: Fraude en las Personas Jurídicas</li>
            <li>Código Penal Peruano: Delitos Contra El Patrimonio Cultural</li>
            <li>Decreto Legislativo N°813: Ley Penal Tributaria</li>
            <li>Ley N°28008: Delitos Aduaneros</li>
        </ul>

        <div class="clause-title">DÉCIMO OCTAVA: VALIDEZ</div>
        <div class="clause-text">
            Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.
        </div>

        <div class="clause-title">DÉCIMO NOVENA: DE LOS EXÁMENES MÉDICOS</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR</span> se someterá obligatoriamente a los exámenes médicos que dispongan <span class="bold">EL EMPLEADOR</span> y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.
        </div>

        <div class="clause-title">VIGESIMO: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO</div>
        <div class="clause-text">
            De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato <span class="bold">(ANEXO – 1),</span> se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que <span class="bold">EL TRABAJADOR</span> deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.
        </div>

        <div class="clause-title">VIGÉSIMO PRIMERA: DOMICILIO</div>
        <div class="clause-text">
            Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato. Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.
        </div>

        <div class="clause-title">VIGÉSIMA SEGUNDO: SOLUCIÓN DE DISPUTAS</div>
        <div class="clause-row">
            <div class="clause-num">22.1</div>
            <div class="clause-text">
                En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el fin de lograr una solución armoniosa a sus diferencias.
            </div>
        </div>
        <div class="clause-row">
            <div class="clause-num">22.2</div>
            <div class="clause-text">
                Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.
            </div>
        </div>

        <div class="clause-title">VIGÉSIMA TERCERA: APLICACIÓN SUPLETORIA</div>
        <div class="clause-text">
            En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.
        </div>

        <div style="margin-top: 10px; text-align: justify;">
            En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de {{province}}, el día {{entryDate}}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.
        </div>

         <div class="signatures-wrapper">
            <div class="signature-col">
                {{#if signature1}}
                    <img src="{{signature1}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer1Name}}</div>
                <div class="signature-text">DNI N°: {{signer1DNI}}</div>
            </div>

            <div class="signature-col">
                {{#if signature2}}
                    <img src="{{signature2}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer2Name}}</div>
                <div class="signature-text">DNI N°: {{signer2DNI}}</div>
            </div>

            <div class="signature-col">
                <div style="height: 55px;"></div>
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL TRABAJADOR</div>
                <div class="signature-text">NOMBRE: {{fullName}}</div>
                <div class="signature-text">DNI: {{dni}}</div>
                <div class="signature-text">DIVISIÓN: {{subDivision}}</div>
            </div>
        </div>

    </body>
    </html>
    `;
export const ANEXO = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>{{dni}}</title>
      <style>
            body {
                font-family: 'Arial', sans-serif;
                font-size: 7pt;
                line-height: 1.3;
                color: #000;
                margin-left: 1.59cm;
                margin-right: 0.74cm;
                padding: 0;
            }
            .text-center { text-align: center; }
            .text-justify { text-align: justify; }
            .underline { text-decoration: underline;}
            .bold { font-weight: bold; }
            
            /* Tablas */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                margin-bottom: 10px;
                font-size: 8pt;
            }
            thead {
                display: table-row-group;
            }
            th, td {
                border: 1px solid #000;
                padding: 0px 5px 0px 5px;
                vertical-align: top; /* Mejor que middle para textos largos */
            }
                tbody td:first-child {
                text-align: left;
                vertical-align: middle; /* Centrado vertical (opcional, pero se ve mejor) */
            }
            th {
                background-color: #93c5fd;
                text-align: center;
                font-weight: bold; /* Aseguramos negrita en encabezados */
            }
                
            .col-1 { width: 30%;padding: 10px ;}
            .col-2 { width: 70%; padding: 10px;}

            .custom-list-item {
                display: block; 
                margin-bottom: 8px;
                text-align: justify;
                padding-left: 15px; 
                text-indent: -15px; 
            }

               /* Contenedor de Firmas (Flexbox para 3 columnas) */
        .signature-container {
            margin-top: 50px; /* Espacio antes de las firmas */
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            page-break-inside: avoid; /* Evita que las firmas se corten entre páginas */
            width: 100%;
        }

        .signatures-wrapper {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start; /* Alinea al fondo */
                page-break-inside: avoid; /* Evita que las firmas se corten */
            }
            .signature-col {
                width: 31%; /* 3 columnas aprox */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-img {
                height: 50px;
                width: 85px;
                object-fit: contain;
                margin-bottom: 5px;
            }
            .signature-line {
                width: 100%;
                border-top: 1px solid #000;
                margin-bottom: 5px;
            }
            .signature-text {
                font-size: 8pt;
                width: 100%;
                text-align: left;
                line-height: 1.2;
            }
            .center-text { text-align: center; }
        </style>
    </head>
    <body>

        <div class="text-center bold">ANEXO 1</div>
        <div class="text-center bold underline">RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO</div>
        <div class="text-center bold" style="margin-bottom: 18px;">(Ley Nº 29783, Art. 35º, inc. c))</div>

        <div class="text-justify">
            De acuerdo a lo establecido en el artículo 35 de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo, y el artículo 30 de su Reglamento aprobado por Decreto Supremo N° 005-2012-TR, por medio del presente documento <span class="bold">EL EMPLEADOR </span>cumple con describir las recomendaciones de seguridad y salud en el trabajo que deberá tener presente y cumplir <span class="bold">EL TRABAJADOR, </span>en la ejecución de sus funciones para EL EMPLEADOR en el puesto de <span class="bold">{{position}}</span>
        </div>
        
        <div class="text-justify" style="margin-top: 10px;">
            <span class="bold">EL TRABAJADOR </span>deberá tener presente los siguientes riesgos propios del centro de trabajo donde prestará sus servicios, así como las medidas de protección y prevención en relación con tales riesgos:
        </div>

        <table>
            <thead>
                <tr>
                    <th class="col-1">Riesgos asociados </th>
                    <th class="col-2">Medidas de protección y prevención</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Caídas al mismo nivel</td>
                    <td> - Mantener el orden y limpieza en las zonas de trabajo.<br> - Mantener las zonas de tránsito libre de obstáculos (cajas, papeleras, cables, etc.).<br> - Extremar las precauciones con el suelo mojado y especialmente resbaladizo <br> - Respetar las señales de advertencia.</td>
                </tr>
                <tr>
                    <td>Caídas a distinto nivel</td>
                    <td> - Utilizar los pasamanos al bajar o subir las escaleras.<br> - Respetar las señales de advertencia.</td>
                </tr>
                <tr>
                    <td>Riesgo eléctrico</td>
                    <td> - No sobrecargar los enchufes.<br> - Respetar las señales de advertencia.<br> - No manipular los cuadros eléctricos, excepto personal debidamente autorizado y <br> &nbsp;&nbsp;capacitado para ello.</td>
                </tr>
                <tr>
                    <td>Quemaduras, incendios, explosiones</td>
                    <td> - Revisar periódicamente la instalación de combustible y el correcto funcionamiento <br> &nbsp;&nbsp;de los medios de protección contra incendios.<br> - Conocer y respetar las vías de evacuación y salidas de emergencia existentes en <br> &nbsp;&nbsp;el área de trabajo.</td>
                </tr>
            </tbody>
        </table>

        <div class="text-justify" style="margin-bottom: 10px;">
            1. Asimismo, EL TRABAJADOR deberá tener presente los siguientes riesgos propios del puesto de trabajo de [*] que desempeñará en EL EMPLEADOR, así como las medidas de protección y prevención relacionadas con tales riesgos:
        </div>

        <table>
            <thead>
                <tr>
                    <th class="col-1">Riesgos asociados </th>
                    <th class="col-2">Medidas de protección y prevención</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Lesiones por la espalda por sobreesfuerzos</td>
                    <td> - Utilizar, si es posible, medios mecánicos para transportar objetos, sobre todo si las <br> &nbsp;&nbsp;cargas son pesadas, voluminosas o si la frecuencia con que estas se manipulan <br> &nbsp;&nbsp;son elevadas.<br> - Solicitar ayuda a otra persona.</td>
                </tr>
                <tr>
                    <td>Lesiones por movimientos forzados</td>
                    <td> - Utilizar sillas ergonómicas y ajustar la altura de la pantalla del computador a la <br> &nbsp;&nbsp;altura de los ojos.</td>
                </tr>
                <tr>
                    <td>Lesiones en dedos o muñecas por la incorrecta colocación de la mano combinada con la frecuencia de pulsación</td>
                    <td> - Evitar hacer presión sobre las muñecas.<br> - Utilizar almohadilla de apoyo para mejorar la posición de las muñecas al utilizar el <br> &nbsp;&nbsp;teclado y mouse.<br> - El antebrazo, la muñeca y la mano deben formar una línea recta.</td>
                </tr>
                <tr>
                    <td>Molestias / lesiones lumbares por posturas inadecuadas</td>
                    <td> - Cambios de posturas de forma periódica.<br> - Pausas activas. <br> - Verificar altura de mesa de trabajo. <br> - Sentarse correctamente sobre sillas ergonómicas.<br> - Ajustar la altura de la silla; al apoyar las manos en el teclado, el brazo y antebrazo <br> &nbsp;&nbsp;debe formar un ángulo de 90°.</td>
                </tr>
                <tr>
                    <td>Daños al sistema músculo esquelético por posturas estáticas prolongadas</td>
                    <td> - Utilizar el asiento colocado de tal forma que los movimientos se realicen sin forzar <br> &nbsp;&nbsp;la postura.<br> - Adecuar el escritorio, silla y computador para evitar posturas forzadas.</td>
                </tr>
                <tr>
                    <td>Caídas de objetos en manipulación</td>
                    <td> - Utilizar escalerillas o plataformas para alcanzar objetos situados a una altura por <br> &nbsp;&nbsp;encima de los hombros para evitar golpes por caída de los mismos durante la <br> &nbsp;&nbsp;manipulación.</td>
                </tr>
                <tr>
                    <td>Caídas al mismo nivel</td>
                    <td> - Mantener el orden y limpieza en las zonas de trabajo.<br> - Mantener las zonas de tránsito libre de obstáculos (cajas, papeleras, cables, etc.).<br> - Extremar las precauciones con el suelo mojado y especialmente resbaladizo.<br> - Respetar las señales de advertencia.</td>
                </tr>
                <tr>
                    <td>Caídas a distinto nivel</td>
                    <td> - Utilizar los pasamanos al bajar o subir las escaleras.<br> - Respetar las señales de advertencia.</td>
                </tr>
                <tr>
                    <td>Golpes contra objetos y por objetos</td>
                    <td> - Realizar orden y limpieza en el puesto de trabajo. <br> - Mantener los objetos, piezas, elementos en su lugar.<br> - Comprobar que el recorrido esté libre de obstáculos.</td>
                </tr>
                <tr>
                    <td>Golpes contra muebles u objetos inmóviles (cajones abiertos u otros)</td>
                    <td> - Mantener cajones y puertas cerradas, de esta manera se evitarán posibles golpes <br> &nbsp;&nbsp;o caídas. <br> - No colocar mobiliario o almacenar material de oficina en zonas de paso habitual.</td>
                </tr>
                <tr>
                    <td>Golpes por uso inadecuado de herramientas</td>
                    <td> - Utilizar la herramienta de diseño adecuado para el trabajo a realizar.</td>
                </tr>
                <tr>
                    <td>Cortes en la mano por contacto con elementos y herramientas cortantes</td>
                    <td> - Utilizar equipos de protección personal (EPP). <br> - Los mangos de las herramientas deben conservarse en perfectas condiciones.</td>
                </tr>
                <tr>
                    <td>Micro traumatismos en procesos de corte repetitivos</td>
                    <td> - Hacer uso de las herramientas de forma adecuada y haciendo uso del manual del<br> &nbsp;&nbsp;fabricante.</td>
                </tr>
                <tr>
                    <td>Sobreesfuerzo por manipulación de objetos pesados</td>
                    <td> En las operaciones de manipulación manual de cargas se deben adoptar las <br> &nbsp;&nbsp;posturas y movimientos adecuados:<br> - Aproximarse a la carga lo máximo posible. <br> - Asegurar un buen apoyo de los pies, manteniéndolos ligeramente separados. En <br> &nbsp;&nbsp;caso el objeto esté sobre una base elevada,aproximarlo al tronco, consiguiendo <br> &nbsp;&nbsp;una base y agarre firme y estable.<br> - Agacharse flexionando las rodillas, manteniendo la espalda recta.<br> - Levantar la carga utilizando los músculos de las piernas y no con la espalda.<br> - Tomar firmemente la carga con las dos manos.<br> - Mantener la carga próxima al cuerpo durante todo el trayecto y andar dando pasos<br> &nbsp;&nbsp;cortos.<br> - En elevaciones con giro, procurar mover los pies en vez de girar la cintura. <br> - Evitar los movimientos bruscos en la espalda, en especial los giros, incluso cuando <br> &nbsp;&nbsp;se maneja carga ligera.</td>
                </tr>
                <tr>
                    <td>Sobreesfuerzos por manipulación manual de cargas y movimientos repetitivos</td>
                    <td> - Evitar los movimientos repetitivos frecuentes.<br> - Alternar dichos movimientos con los de otras operaciones que, aunque también <br> &nbsp;&nbsp;supongan movimientos repetitivos, sean producidos por otros grupos<br> &nbsp;&nbsp;musculares (cambiar de mano y de postura de forma periódica)</td>
                </tr>
                <tr>
                    <td>Contacto eléctrico con uniones defectuosas sin aislaciones</td>
                    <td> - No disponer cables en zonas de paso.</td>
                </tr>
                <tr>
                    <td>Contactos eléctricos indirectos, con partes o elementos metálicos accidentalmente puestos bajo tensión</td>
                    <td> - Revisar los equipos eléctricos antes de utilizarlos.<br> - No utilizar / manipular herramientas eléctricas que se encuentran húmedas o <br> &nbsp;&nbsp;mojadas, ni equipos en mal estado.</td>
                </tr>
                <tr>
                    <td>Contactos eléctricos por usar extensiones subestándar en los enchufes</td>
                    <td> - Utilizar enchufes correctamente. <br> - No sobrecargar los enchufes. <br> - No tirar de los cables. <br> - Apagar los equipos (computadoras, impresoras, fotocopiadoras, etc.) cuando <br> &nbsp;&nbsp;finalice la jornada.</td>
                </tr>
                <tr>
                    <td>Quemaduras por cortocircuitos</td>
                    <td> - No utilizar herramientas eléctricas con las manos o los pies húmedos.</td>
                </tr>
                <tr>
                    <td>Quemaduras por trabajar con hornos y manejar objetos calientes</td>
                    <td> - Utilizar los equipos de protección personal (EPP).</td>
                </tr>
                <tr>
                    <td>Sobrecarga mental por estrés por atención al público</td>
                    <td> - Mantener disponible la información más frecuente y necesaria solicitada por los<br> &nbsp;&nbsp;usuarios. <br> - Liberar el escritorio de documentación. <br> - Crear un grado de autonomía adecuado en el ritmo y organización básica del &nbsp;&nbsp;trabajo. <br> - Hacer pausas para los cambios de postura y reducción de fatiga física y mental.</td>
                </tr>
                <tr>
                    <td>Fatiga visual: aumento del parpadeo, lagrimeo, pesadez en parpados u ojos</td>
                    <td> - Verificar que l apantalle esté entre 10° y 60° por debajo de la horizontal de los ojos &nbsp;&nbsp; del operador.<br> - Establecer pausas de 10 minutos cada 90 o 60 minutos de trabajo.<br> - Alternar la visualización de la pantalla con impresos para descansar la vista.<br> - Utilizar la iluminación adecuada en el lugar de trabajo.<br> - Eliminar los reflejos originados por las ventanas, colocando cortinas.<br> - Realizar hábitos saludables: descanso adecuado y alimentación saludable.</td>
                </tr>
                <tr>
                    <td>Fatiga física: dolor habitual en región cervical, dorsal o lumbar, tensión en hombros, cuello o espalda, molestias en las piernas (adormecimiento)</td>
                    <td> - Utilizar un espacio de trabajo con dimensiones adecuadas.<br> - Utilizar sillas con base estable y regulación en altura. El respaldo lumbar debe ser<br> &nbsp;&nbsp;ajustable en inclinación.</td>
                </tr>
                <tr>
                    <td>Fatiga auditiva</td>
                    <td> - Aislar impresoras, ventiladores y fotocopiadoras de la zona de trabajo de las <br> &nbsp;&nbsp;personas que realizan trabajo intelectual.</td>
                </tr>
                <tr>
                    <td>Estrés por sobrecarga de trabajo y falta de control de las actividades</td>
                    <td> - Delegar las responsabilidades al personal.<br> - Mantener la calma en situaciones conflictivas. <br> - Trabajar coordinadamente. <br> - Reorganizar el tiempo de trabajo por cada actividad.</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-bottom: 12px;">
            Adicionalmente, EL TRABAJADOR &nbsp;se obliga a cumplir rigurosamente las disposiciones que a continuación se indican a título enunciativo, más no limitativo:
        </div>

        <div class="custom-list-item">
            - &nbsp;Leer y practicar estrictamente las obligaciones contenidas en el Reglamento Interno de Seguridad y Salud en el Trabajo (“RISST”).
        </div>
        <div class="custom-list-item">
            - &nbsp;Respetar y aplicar las medidas de prevención de riesgos señaladas en el mapa de riesgos.
        </div>
        <div class="custom-list-item">
            <span class="bold">- &nbsp;EL TRABAJADOR </span>&nbsp;tiene la obligación de comunicar al área SSOMA todo evento o situación que ponga o pueda poner en riesgo su seguridad y salud, o la de sus compañeros, siempre que éstas se produzcan dentro de las instalaciones de
        </div>
        <div class="custom-list-item">
            <span class="bold">- &nbsp;EL TRABAJADOR </span>&nbsp;se compromete a someterse a los exámenes médicos a los que, en función al cargo y funciones &nbsp;desempeñadas, se encuentren obligados.
        </div>
        <div class="custom-list-item">
            <span class="bold">- &nbsp;EL TRABAJADOR </span>&nbsp;se compromete a respetar y aplicar los estándares de seguridad y salud establecidos para el puesto que desarrolla.
        </div>
        <div class="custom-list-item">
            - &nbsp;Constituye falta grave sancionable, el uso indebido o no uso por parte de <span class="bold">&nbsp;EL TRABAJADOR </span>&nbsp;de los instrumentos y materiales de trabajo, así como de los equipos de protección personal y colectiva que proporcione <span class="bold">&nbsp;EL EMPLEADOR </span>&nbsp;o el o el incumplimiento de cualquier otra medida de prevención o protección.
        </div>

        <div style="margin-top: 12px; margin-bottom: 12px;">
            Las presentes medidas son de obligatorio cumplimiento en tanto que no se desarrollen otras que puedan modificarlas.
        </div>

        <div class="text-justify" style="margin-bottom: 50px;">
            En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de <span class="bold">{{department}}, </span>el día <span class="bold">{{entryDate}}</span> quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.
        </div>

        <div class="signatures-wrapper">
            <div class="signature-col">
                {{#if signature1}}
                    <img src="{{signature1}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer1Name}}</div>
                <div class="signature-text">DNI N°: {{signer1DNI}}</div>
            </div>

            <div class="signature-col">
                {{#if signature2}}
                    <img src="{{signature2}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer2Name}}</div>
                <div class="signature-text">DNI N°: {{signer2DNI}}</div>
            </div>

            <div class="signature-col">
                <div style="height: 55px;"></div>
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL TRABAJADOR</div>
                <div class="signature-text">NOMBRE: {{fullName}}</div>
                <div class="signature-text">DNI: {{dni}}</div>
                <div class="signature-text">PLAYA: {{division}}</div>
            </div>
        </div>

    </body>
    </html>
    `;
export const CONTRACT_SUBSIDIO = `
 <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>{{dni}}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                font-size: 8pt;
                line-height: 1.3;
                text-align: justify;
                text-justify: inter-word;
                margin-right: 0.25cm; /* Sangría Derecha exacta de tu Word */
            }
            .intro-paragraph {
                margin-bottom: 16px;  /* El espacio que ya tenías debajo */
            }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            
            /* Títulos de las cláusulas */
            .clause-title {
                font-size: 8pt; /* Ligeramente más grande para resaltar */
                font-weight: bold;
                text-decoration: underline;
                margin-top: 12px;
                margin-bottom:12px;
                display: block;
                text-align: left;
            }

            /* Estructura Flex para párrafos numerados (ej: 1.1 Texto) */
            .clause-row {
                display: flex;
            }
            .clause-num {
                min-width: 35px; /* Tu variable numberWidth */
                font-weight: normal;
            }
            .clause-text {
                width: 100%;
                text-align: justify;
            }

            /* Listas indentadas (a, b, c) */
            .list-row {
                display: flex;
                margin-left: 35px; /* Indentación extra */
            }
            .list-bullet {
                min-width: 30px;
            }
            
            /* Listas de leyes (bullets) */
            .bullet-row {
                margin-left: 30px;
            }

           /* Sección de Firmas */
            .signatures-wrapper {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start; /* Alinea al fondo */
                page-break-inside: avoid; /* Evita que las firmas se corten */
            }
            .signature-col {
                width: 31%; /* 3 columnas aprox */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-img {
                height: 50px;
                width: 85px;
                object-fit: contain;
                margin-bottom: 5px;
            }
            .signature-line {
                width: 100%;
                border-top: 1px solid #000;
                margin-bottom: 5px;
            }
            .signature-text {
                font-size: 8pt;
                width: 100%;
                text-align: left;
                line-height: 1.2;
            }
        </style>
</head>
<body>

    <div class="text-center bold underline" style="font-size: 7pt; margin-bottom: 15px;">
        CONTRATO DE TRABAJO SUJETO A MODALIDAD DE SUPLENCIA
    </div>

    <div class="intro-paragraph">
        Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el Contrato por Incremento de Actividades, que, al amparo de lo dispuesto en los  Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N’ 002-97-TR,  celebran, de una parte, la empresa <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.,</span> con R.U.C. Nº 20603381697, con domicilio en  Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662  y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará <span class="bold">“EL EMPLEADOR”</span>; y de otra parte, el <span class="bold">Sr.(a). {{fullName}} </span>identificado con <span class="bold">DNI N° {{dni}}, </span>de nacionalidad peruana, con domicilio en <span class="bold">{{address}}, </span>Distrito de <span class="bold">{{district}}, </span>Provincia de <span class="bold">{{province}} </span>y Departamento de <span class="bold">{{department}} </span>a quien en adelante se le denominará <span class="bold">“EL TRABAJADOR”; </span>y que en conjunto serán denominados “Las Partes”,&nbsp; en los términos y condiciones siguientes:
    </div>

    <div class="clause-title">PRIMERO: PARTES DEL CONTRATO</div>

    <div class="clause-row">
        <div class="clause-num">1.1</div>
        <div class="clause-text">
            <span class="bold">EL EMPLEADOR </span>es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">1.2</div>
        <div class="clause-text">
            <span class="bold">EL EMPLEADOR </span>requiere contratar a <span class="bold">EL TRABAJADOR </span>para cubrir la ausencia del trabajador <span class="bold">{{firstAndfirstLastName}} </span><span class="bold">{{secondLastName}} </span>(en adelante <span class="bold">EL SUPLIDO) </span>quién viene ocupando el cargo de <span class="bold">{{position}} </span>en la Playa <span class="bold">{{subDivisionOrParking}} </span>el mismo que por motivos de <span class="bold">{{reasonForSubstitution}} </span>se ausentará por espacio de <span class="bold">{{timeForCompany}}.</span>
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">1.3</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR, </span>declara tener experiencia en <span class="bold">{{position}}, </span>por lo que cuenta con las condiciones necesarias para ocupar el cargo de <span class="bold">{{position}}, </span>durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.
        </div>
    </div>

    <div class="clause-title">SEGUNDO: OBJETO DEL CONTRATO</div>

    <div class="clause-row">
        <div class="clause-num">2.1</div>
        <div class="clause-text">
            Por el presente documento <span class="bold">EL EMPLEADOR </span>contrata los servicios de <span class="bold">EL TRABAJADOR </span>a plazo fijo bajo la modalidad de <span class="bold">SUPLENCIA </span>para que desempeñe el cargo de <span class="bold">{{position}} </span>asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">2.2</div>
        <div class="clause-text">
            Las partes reconocen y declaran que el cargo de <span class="bold">EL TRABAJADOR </span>está sujeto a supervisión inmediata y corresponde a uno de <span class="bold">{{workingCondition}} </span>de acuerdo a lo establecido en el artículo 43 del Decreto Supremo Nro. 003-97-TR.
        </div>
    </div>

    <div class="clause-title">TERCERO: PLAZO</div>

    <div class="clause-row">
        <div class="clause-num">3.1</div>
        <div class="clause-text">
            Las labores que desarrollará <span class="bold">EL TRABAJADOR </span>tendrán una duración de <span class="bold">{{timeForCompany}} </span>tendrán una duración de tiempo estimado para superar el incidente que motiva el presente Contrato, según lo precisado en la cláusula 1.2 precedente.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">3.2</div>
        <div class="clause-text">
            El plazo del presente Contrato se contabilizarán desde el día <span class="bold">{{entryDate}} </span>y concluirán de manera definitiva el día <span class="bold">{{endDate}} </span>no obstante, Las Partes acuerdan expresamente en caso de que EL SUPLIDO se reincorpore a su puesto de trabajo antes del plazo pactado, el presente contrato quedara extinguido en conformidad con el Art. 61 del Decreto Supremo Nro. 003-97-TR.
        </div>
    </div>

    <div class="clause-title">CUARTO: PERÍODO DE PRUEBA</div>

    <div class="clause-row">
        <div class="clause-text">
            Ambas partes acuerdan en pactar un período de prueba de <span class="bold">{{probationaryPeriod}} </span>de acuerdo con lo que establece el artículo 10 de la Ley de Productividad y Competitividad Laboral.
        </div>
    </div>

    <div class="clause-title">QUINTO: REMUNERACION</div>

    <div class="clause-row">
        <div class="clause-num">5.1</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>recibirá por la prestación íntegra y oportuna de sus servicios, una remuneración bruta mensual de <span class="bold">{{salaryFormatted}} </span><span class="bold">{{salaryInWords}}, </span>más la asignación familiar correspondiente de ser el caso, de la cual se deducirán las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">5.2</div>
        <div class="clause-text">
            Adicionalmente, <span class="bold">EL TRABAJADOR </span>tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones, al convenio celebrado o a las que <span class="bold">EL EMPLEADOR, </span>a título de liberalidad, le otorgue.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">5.3</div>
        <div class="clause-text">
            Será de cargo de <span class="bold">EL TRABAJADOR, </span>el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de Pensiones, las que serán retenidas por <span class="bold">EL EMPLEADOR, </span>así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.
        </div>
    </div>

    <div class="clause-title">SEXTO: JORNADA DE TRABAJO</div>

    <div class="paragraph">
        En relación a la Jornada de Trabajo, <span class="bold">EL EMPLEADOR y EL TRABAJADOR </span>acuerdan lo siguiente:
    </div>

    <div class="clause-row">
        <div class="clause-num">6.1</div>
        <div class="clause-text">
            La jornada de trabajo es de 48 horas semanales flexible, teniendo <span class="bold">EL EMPLEADOR </span>la facultad de establecer el horario de trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">6.2</div>
        <div class="clause-text">
            El tiempo de Refrigerio no forma parte de la jornada de trabajo.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">6.3</div>
        <div class="clause-text">
            Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán compensar con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas semanales en promedio. Asimismo, acuerdan que <span class="bold">EL EMPLEADOR </span>podrá introducir modificaciones al horario y jornada de trabajo, establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados, respetando la jornada máxima establecida por Ley.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">6.4</div>
        <div class="clause-text">
            El trabajo en sobretiempo de <span class="bold">EL TRABAJADOR </span>es estrictamente voluntario y, a solicitud de <span class="bold">EL EMPLEADOR </span>debiendo <span class="bold">EL TRABAJADOR </span>contar con autorización escrita de <span class="bold">EL EMPLEADOR </span>para realizar horas extras, según lo establecido en el Reglamento Interno de Trabajo. El trabajo en sobretiemp debe ser prestado de manera efectiva, no considerándose como tal la sola permanencia en las instalaciones de <span class="bold">EL EMPLEADOR.</span>
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">6.5</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR y EL EMPLEADOR </span>acuerdan que durante la vigencia de la relación laboral podrán compensar el trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto en contrario.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">6.6</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>por su cargo y la naturaleza de su prestación de servicios se encuentra sujeto de control. Ambas partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por <span class="bold">EL EMPLEADOR </span>de acuerdo con sus necesidades operativas.
        </div>
    </div>

    <div class="clause-title">SÉTIMA: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR</div>

    <div class="paragraph">
        Por medio del presente documento, <span class="bold">EL TRABAJADOR </span>se obliga, referencialmente, a:
    </div>

    <div class="clause-row">
        <div class="clause-num">7.1</div>
        <div class="clause-text">
            Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale <span class="bold">EL EMPLEADOR </span>o sus representantes, para realizar las actividades que correspondan a su cargo.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.2</div>
        <div class="clause-text">
            La prestación laboral deberá ser efectuada de manera personal, no pudiendo <span class="bold">EL TRABAJADOR </span>ser reemplazado ni asistido por terceros, debiendo <span class="bold">EL TRABAJADOR </span>cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por <span class="bold">EL EMPLEADOR.</span>
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.3</div>
        <div class="clause-text">
            Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y experiencia profesional en el cumplimiento de los objetivos y estrategias de <span class="bold">EL EMPLEADOR.</span>
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.4</div>
        <div class="clause-text">
            Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones directivas, circulares reglamentos, normas, etc., que expida <span class="bold">EL EMPLEADOR; </span>declarando conocer todas aquellas que se encuentran vigentes.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.5</div>
        <div class="clause-text">
            No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro de <span class="bold">EL EMPLEADOR, </span>en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. <span class="bold">EL TRABAJADOR, </span>declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.6</div>
        <div class="clause-text">
            Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc. que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.7</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>se obliga a respetar los procedimientos de evaluación d rendimiento y desempeño laboral que tiene establecidos <span class="bold">EL EMPLEADOR </span>con el objeto de valorar el nivel de eficiencia logrado por <span class="bold">EL EMPLEADOR </span>en su puesto de trabajo.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">7.8</div>
        <div class="clause-text">
            Cualquier otra obligación prevista en este contrato, establecida por <span class="bold">EL EMPLEADOR, </span>que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.
        </div>
    </div>

    <div class="clause-title">OCTAVA: OBLIGACIONES DEL EMPLEADOR</div>

    <div class="clause-row">
        <div class="clause-num">8.1</div>
        <div class="clause-text">
            Pagar a <span class="bold">EL TRABAJADOR </span>todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago. Registrar los pagos realizados a <span class="bold">EL TRABAJADOR </span>en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">8.2</div>
        <div class="clause-text">
            Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">8.3</div>
        <div class="clause-text">
            Retener de la remuneración bruta mensual de <span class="bold">EL TRABAJADOR, </span>las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">8.4</div>
        <div class="clause-text">
            Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.
        </div>
    </div>

    <div class="clause-title">NOVENA: DECLARACIONES DE LAS PARTES</div>

    <div>
        Las partes reconocen, acuerdan y declaran lo siguiente:
    </div>

    <div class="clause-row">
        <div class="clause-num">9.1</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">9.2</div>
        <div class="clause-text">
            De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, <span class="bold">EL EMPLEADOR </span>se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">9.3</div>
        <div class="clause-text">
            Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que <span class="bold">EL TRABAJADOR </span>prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">9.4</div>
        <div class="clause-text">
            Las partes convienen que <span class="bold">EL EMPLEADOR </span>tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de <span class="bold">EL TRABAJADOR.</span>
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">9.5</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR y EL EMPLEDOR </span>acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante (s) legal (es) de <span class="bold">EL EMPLEDOR </span>con firma (s) digitalizada (s), una vez que la (s) firma (s) sea (n) inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">9.6</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR y EL EMPLEADOR </span>acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente <span class="bold">EL EMPLEADOR </span>prestando <span class="bold">EL TRABAJADOR </span>su consentimiento expreso para ello. Asimismo, <span class="bold">EL TRABAJADOR </span>declara como su dirección electrónica <span class="bold">{{email}} </span>en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose <span class="bold">EL TRABAJADOR </span>a informar por escrito a <span class="bold">EL EMPLEADOR </span>cualquier cambio de su dirección electrónica.
        </div>
    </div>

    <div class="clause-title">DÉCIMA: TÉRMINO DEL CONTRATO</div>

    <div class="clause-row">
        <div class="clause-num">10.1</div>
        <div class="clause-text">
            Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista en la cláusula tercera, salvo que las necesidades aun persistan, escenario en el que <span class="bold">EL EMPLEADOR </span>propondrá a <span class="bold">EL TRABAJADOR </span>suscribir una renovación por escrito. Por lo tanto, <span class="bold">EL EMPLEADOR </span>no está obligado a dar ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a <span class="bold">EL TRABAJADOR </span>los beneficios sociales que le pudieran corresponder de acuerdo a ley. <span class="bold">EL EMPLEADOR </span>podrá resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo Nº 728, Decreto Supremo Nº 003-97-TR.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">10.2</div>
        <div class="clause-text">
            Además, son causales de resolución del presente contrato las siguientes:
        </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">a)</div>
        <div class="clause-text">La voluntad concertada de las partes</div>
    </div>
    <div class="list-row">
        <div class="list-bullet">b)</div>
        <div class="clause-text">El incumplimiento de las obligaciones estipuladas en el presente documento.</div>
    </div>
    <div class="list-row">
        <div class="list-bullet">c)</div>
        <div class="clause-text">La comisión de falta grave por parte de <span class="bold">EL TRABAJADOR </span>prevista en las normas que resulten aplicables.</div>
    </div>
    <div class="list-row">
        <div class="list-bullet">d)</div>
        <div class="clause-text">La reincorporación de EL SUPLIDO a su puesto de trabajo.</div>
    </div>
    <div class="list-row">
        <div class="list-bullet">e)</div>
        <div class="clause-text">Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.</div>
    </div>
  
    <div class="clause-title">DÉCIMA PRIMERA: PROPIEDAD INTELECTUAL</div>

    <div class="clause-row">
        <div class="clause-num">11.1</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>cede y transfiere a <span class="bold">EL EMPLEADOR </span>en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando <span class="bold"> EL TRABAJADOR </span>facultado para publicar o reproducir en forma íntegra o parcial dicha información.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">11.2</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR, </span>en virtud del presente contrato laboral, cede en exclusiva a <span class="bold">EL EMPLEADOR </span>todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">11.3</div>
        <div class="clause-text">
            Por lo tanto, toda información creada u originada es de propiedad exclusiva de <span class="bold">EL EMPLEADOR, </span>quedando <span class="bold">EL TRABAJADOR </span>prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de <span class="bold">EL EMPLEADOR. </span>Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">11.4</div>
        <div class="clause-text">
            En ese sentido, <span class="bold">EL TRABAJADOR </span>acepta que <span class="bold">EL EMPLEADOR </span>tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por <span class="bold">EL EMPLEADOR a EL TRABAJADOR </span>para el cumplimiento de sus funciones.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">11.5</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR</span> declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
        </div>
    </div>

    <div class="clause-title">DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO</div>

    <div class="clause-row">
        <div class="clause-num">12.1</div>
        <div class="clause-text">
            <span class="bold">EL EMPLEADOR </span>facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio que pueda crear a futuro.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">12.2</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. <span class="bold">EL TRABAJADOR </span>reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">12.3</div>
        <div class="clause-text">
            En ese sentido, <span class="bold">EL TRABAJADOR </span>acepta que <span class="bold">LA EMPRESA </span>tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a <span class="bold">EL TRABAJADOR </span>copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.
        </div>
    </div>

    <div class="clause-title">DÉCIMO TERCERA: EXCLUSIVIDAD</div>

    <div class="clause-row">
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>es contratado de forma exclusiva por <span class="bold">EL EMPLEADOR, </span>por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de <span class="bold">EL EMPLEADOR.</span>
        </div>
    </div>

    <div class="clause-title">DÉCIMO CUARTA: NO COMPETENCIA</div>

    <div class="clause-row">
        <div class="clause-num">14.1</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>se compromete a no competir con <span class="bold">EL EMPLEADOR, </span>en los términos y condiciones que se acuerdan a continuación:
        </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">a.</div>
        <div class="clause-text">A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de <span class="bold">EL EMPLEADOR.</span></div>
    </div>
    <div class="list-row">
        <div class="list-bullet">b.</div>
        <div class="clause-text">A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con <span class="bold">EL EMPLEADOR.</span></div>
    </div>
    
    <div class="list-row">
        <div class="list-bullet">c.</div>
        <div class="clause-text">A no utilizar la información de carácter reservado que le fue proporcionada por <span class="bold">EL EMPLEADOR </span>para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar <span class="bold">EL EMPLEADOR.</span></div>
    </div>
    <div class="list-row">
        <div class="list-bullet">d.</div>
        <div class="clause-text">A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de <span class="bold">EL EMPLEADOR </span>a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para <span class="bold">EL TRABAJADOR </span>o para cualquier otra persona, entidad, institución o empresa, que compita con <span class="bold">EL EMPLEADOR.</span></div>
    </div>

    <div class="clause-row">
        <div class="clause-num">14.2</div>
        <div class="clause-text">
            Las obligaciones que <span class="bold">EL TRABAJADOR </span>asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">14.3</div>
        <div class="clause-text">
            El incumplimiento por parte de <span class="bold">EL TRABAJADOR </span>de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR </span>a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">14.4</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
        </div>
    </div>

    <div class="clause-title">DÉCIMO QUINTA: RESERVA Y CONFIDENCIALIDAD</div>

    <div class="clause-row">
        <div class="clause-num">15.1</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para <span class="bold">EL EMPLEADOR, </span>en los términos y condiciones que se acuerdan a continuación:
        </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">a.</div>
        <div class="clause-text"> A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre <span class="bold">EL EMPLEADOR </span>y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para <span class="bold">EL EMPLEADOR.</span> </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">b.</div>
        <div class="clause-text"> A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a <span class="bold">EL EMPLEADOR </span>de cualquier naturaleza. </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">c.</div>
        <div class="clause-text"> A no revelar a ninguna persona que preste servicios a <span class="bold">EL EMPLEADOR, </span>ningún tipo de información confidencial o de propiedad de <span class="bold">EL EMPLEADOR, </span>salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, <span class="bold">EL TRABAJADOR, </span>se obliga a solicitar autorización de sus superiores. </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">d.</div>
        <div class="clause-text"> A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por <span class="bold">EL EMPLEADOR, </span>así como a no introducir en las instalaciones de <span class="bold">EL EMPLEADOR, </span>ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. <span class="bold">EL TRABAJADOR </span>se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas. </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">e.</div>
        <div class="clause-text"> A devolver a <span class="bold">EL EMPLEADOR, </span>al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado. </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">15.2</div>
        <div class="clause-text">
            Las obligaciones que <span class="bold">EL TRABAJADOR </span>asume en los literales a), b), c) y d) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">15.3</div>
        <div class="clause-text">
            El incumplimiento por parte de <span class="bold">EL TRABAJADOR </span>de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a <span class="bold">EL EMPLEADOR </span>a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">15.4</div>
        <div class="clause-text">
            <span class="bold">EL TRABAJADOR </span>declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.
        </div>
    </div>

    <div class="clause-title" style="margin-bottom:12px">DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES</div>

    <div class="clause-row">
        <div class="clause-num">16.1</div>
        <div class="clause-text">
           En caso <span class="bold">EL TRABAJADOR </span>accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A. </span>referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.
           <br>
            En cualquier caso, corresponde a <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A. </span>decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose <span class="bold">EL TRABAJADOR </span>a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span>
        </div>
    </div>


    <div class="clause-row">
        <div class="clause-num">16.2</div>
        <div class="clause-text">
            De esta forma, <span class="bold">EL TRABAJADOR </span>queda obligado a:
        </div>
    </div>
    <div class="list-row">
        <div class="list-bullet">a.</div>
        <div class="clause-text"> Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
    </div>
    <div class="list-row">
        <div class="list-bullet">b.</div>
        <div class="clause-text"> Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span></div>
    </div>
    <div class="list-row">
        <div class="list-bullet">c.</div>
        <div class="clause-text"> Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.</div>
    </div>
    
    <div class="clause-row">
        <div class="clause-num">16.3</div>
        <div class="clause-text">
            El incumplimiento de <span class="bold">EL TRABAJADOR </span>respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.
        </div>
    </div>

    <div class="clause-title" style="margin-bottom:12px">DÉCIMO SÉTIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS</div>

    <div class="clause-row">
        <div class="clause-num">17.1</div>
        <div class="clause-text">
            Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">17.2</div>
        <div class="clause-text">
            El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental. EL TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">17.3</div>
        <div class="clause-text">
            Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">17.4</div>
        <div class="clause-text">
            Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-num">17.5</div>
        <div class="clause-text">
            Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las siguientes leyes:
        </div>
    </div>
    <ul class='bullet-row'>
        <li>DL N°1106: Lavado de Activos</li>
        <li>Ley N°25475: Terrorismo</li>
        <li>Código Penal Peruano: Fraude en las Personas Jurídicas</li>
        <li>Código Penal Peruano: Delitos Contra El Patrimonio Cultural</li>
        <li>Decreto Legislativo N°813: Ley Penal Tributaria</li>
        <li>Ley N°28008: Delitos Aduaneros</li>
    </ul>
    <div class"clause-title" style="margin-bttom:12px">DÉCIMO OCTAVA: DE LOS EXAMENES MEDICOS</div>
    <div class="clause-row">
        <div class="clause-text">
        <span class="bold">EL TRABAJADOR</span> se someterá obligatoriamente a los exámenes médicos que dispongan <span class="bold">EL EMPLEADOR</span> y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de <span class="bold">EL TRABAJADOR</span> es motivo determinante de la relación contractual. 
        </div>
    </div>
    <div class="clause-title" style="margin-bottom:12px">DÉCIMO NOVENA: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO</div>

    <div class="clause-row">
        <div class="clause-text">
            De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato <span class="bold">(ANEXO – 1), </span>se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que <span class="bold">EL TRABAJADOR </span>deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.
        </div>
    </div>

    <div class="clause-title">VIGESIMA: VALIDEZ</div>

    <div class="clause-row">
        <div class="clause-text">
            Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado. 
        </div>
    </div>


    <div class="clause-title">VIGÉSIMA PRIMERA: DOMICILIO</div>

    <div class="clause-row">
        <div class="clause-text">
            Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato. Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.
        </div>
    </div>
    <div class="clause-title">VIGÉSIMA SEGUNDA: SOLUCIÓN DE DISPUTAS</div>

    <div class="clause-row">
        <div class="clause-text">
            En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el fin de lograr una solución armoniosa a sus diferencias.
        </div>
    </div>

    <div class="clause-row">
        <div class="clause-text">
            Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.
        </div>
    </div>

    <div class="clause-title">VIGÉSIMA TERCERA: APLICACIÓN SUPLETORIA</div>

    <div class="clause-text">
        En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.
    </div>

    <div class="clause-text">
        En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de  <span class="bold">{{department}}</span>, el día  <span class="bold">{{entryDate}}</span>, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.
    </div>

        <div class="signatures-wrapper">
            <div class="signature-col">
                {{#if signature1}}
                    <img src="{{signature1}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer1Name}}</div>
                <div class="signature-text">DNI N°: {{signer1DNI}}</div>
            </div>

            <div class="signature-col">
                {{#if signature2}}
                    <img src="{{signature2}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer2Name}}</div>
                <div class="signature-text">DNI N°: {{signer2DNI}}</div>
            </div>

            <div class="signature-col">
                <div style="height: 55px;"></div>
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL TRABAJADOR</div>
                <div class="signature-text">NOMBRE: {{fullName}}</div>
                <div class="signature-text">DNI: {{dni}}</div>
                <div class="signature-text">DIVISIÓN: {{subDivision}}</div>
            </div>
        </div>

    </body>
</html>
`;
export const PROCESSING_PERSONAL_DATA = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{dni}}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 7pt; 
            line-height: 1.5;
        }
        .text-center { text-align: center; }
        .text-justify { text-align: justify; }
        .bold { font-weight: bold; }
        .underline { text-decoration: underline; }
        
        .title {
            font-size: 8pt;
            margin-bottom: 20px;
        }

        p {
            margin-bottom: 10px;
            margin-top: 0;
        }

        /* Contenedor de Firmas (Flexbox para 3 columnas) */
        .signature-container {
            margin-top: 50px; /* Espacio antes de las firmas */
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            page-break-inside: avoid; /* Evita que las firmas se corten entre páginas */
            width: 100%;
        }

        .signatures-wrapper {
                margin-top: 50px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start; /* Alinea al fondo */
                page-break-inside: avoid; /* Evita que las firmas se corten */
            }
            .signature-col {
                width: 31%; /* 3 columnas aprox */
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-img {
                height: 50px;
                width: 85px;
                object-fit: contain;
                margin-bottom: 5px;
            }
            .signature-line {
                width: 100%;
                border-top: 1px solid #000;
                margin-bottom: 5px;
            }
            .signature-text {
                font-size: 8pt;
                width: 100%;
                text-align: left;
                line-height: 1.2;
            }
            
    </style>
</head>
<body>

    <div class="text-center bold underline title">
        TRATAMIENTO DE DATOS PERSONALES
    </div>

    <div class="text-justify">
        <p>
            El Sr. <span class="bold">{{fullName}}</span> identificado con DNI N° {{dni}} (en adelante <span class="bold">”EL TRABAJADOR”</span>) declara conocer que sus datos personales entregados o que se entreguen a <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A.</span> como consecuencia de la ejecución del contrato de trabajo, se encuentran incorporados en el banco de datos denominado <span class="bold">“RECURSOS HUMANOS”</span> de titularidad de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA S.A</span> (en adelante <span class="bold">“INVERSIONES URBANÍSTICAS OPERADORA”</span>).
        </p>

        <p>
            El tratamiento que realizará <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA</span> consiste en conservar, registrar, organizar, almacenar, consultar, extraer y utilizar los datos personales con la finalidad de gestionar los recursos humanos de la empresa, como es el caso de la elaboración de las planillas, gestión de la seguridad y salud en el trabajo, cumplimiento de las exigencias y requerimientos del Ministerio de Trabajo y Promoción del Empleo, así como de la Superintendencia Nacional de Aduanas y Administración Tributaria y, todo lo que implica la gestión y seguimiento de la relación laboral, lo cual incluye las capacitaciones, evaluaciones periódicas del personal, entrega de beneficios, y envío de información a las empresas del grupo empresarial, para efectos de control y cumplimiento de las políticas institucionales, entre otros, vinculados exclusivamente a la ejecución de la relación contractual.
        </p>

        <p>
            Cabe indicar que en la medida que la prestación de servicios a cargo de <span class="bold">EL TRABAJADOR</span> importe su destaque en las instalaciones de los clientes de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA,</span> para la prestación del servicio de administración y operación de playa de estacionamiento y valet parking por parte de este último, <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA,</span> se encuentra facultado a remitir información de <span class="bold">EL TRABAJADOR</span> a su cliente, relativa al cumplimiento de las obligaciones laborales a su cargo, de conformidad con la normatividad de la materia.
        </p>

        <p>
            Para efectos de cumplir con la finalidad señalada en el párrafo anterior, <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA</span> cuenta con el apoyo de otras empresas, terceros proveedores de servicios, que actúan en calidad de encargados de tratamiento; los cuales, tienen acceso a los datos personales de los trabajadores; sin perjuicio de las medidas de seguridad establecidas para el efecto.
        </p>

        <p>
            Los datos personales del <span class="bold">TRABAJADOR</span> recolectados por <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA</span> son necesarios para la ejecución de la relación laboral.
        </p>

        <p>
            Con posterioridad a la conclusión del contrato, los datos personales de <span class="bold">EL TRABAJADOR</span> serán conservados únicamente a fin de ser puestos a disposición de las administraciones públicas, el Poder Judicial y demás autoridades, en ejercicios de sus funciones, de acuerdo a los plazos establecidos por ley para el efecto.
        </p>

        <p>
            Además, mediante la presente se informa al <span class="bold">TRABAJADOR,</span> que con fines de control laboral, acorde a lo dispuesto por el artículo 9º del Texto Único Ordenado del Decreto Legislativo N° 728, Ley de Productividad y Competitividad Laboral, aprobado por Decreto Supremo No. 003-97-TR, el desempeño de sus funciones podrá ser video vigilado, actividad que se realizará atendiendo a criterios de razonabilidad y proporcionalidad, y sin afectar los derechos del <span class="bold">TRABAJADOR.</span>
        </p>

        <p>
            El ejercicio por parte del <span class="bold">TRABAJADOR,</span> de sus derechos de acceso, rectificación, cancelación y oposición, se podrá llevar a cabo en los términos dispuestos en la Ley N° 29733 - Ley de Protección de Datos Personales y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS, presentando una solicitud escrita ante la Oficina de Capital Humano de <span class="bold">INVERSIONES URBANÍSTICAS OPERADORA,</span> ubicada en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro. Asimismo, “INVERSIONES URBANÍSTICAS OPERADORA” le informa que podrá establecer otros canales para tramitar estas solicitudes, lo que será informado oportunamente en la página web.”
        </p>
    </div>

    <div class="signatures-wrapper">
            <div class="signature-col">
                {{#if signature1}}
                    <img src="{{signature1}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer1Name}}</div>
                <div class="signature-text">DNI N°: {{signer1DNI}}</div>
            </div>

            <div class="signature-col">
                {{#if signature2}}
                    <img src="{{signature2}}" class="signature-img" />
                {{else}}
                    <div style="height: 55px;"></div>
                {{/if}}
                <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL EMPLEADOR</div>
                <div class="signature-text">NOMBRE: {{signer2Name}}</div>
                <div class="signature-text">DNI N°: {{signer2DNI}}</div>
            </div>

            <div class="signature-col">
                <div style="height: 55px;"></div> <div class="signature-line"></div>
                <div class="signature-text text-center bold">EL TRABAJADOR</div>
                <div class="signature-text">NOMBRE: {{fullName}}</div>
                <div class="signature-text">DNI: {{dni}}</div>
                <div class="signature-text">PLAYA: {{division}}</div>
            </div>
        </div>
</body>
</html>
`;
