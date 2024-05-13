<?php include "../../hyf/header.php" ?>

<p class="formulario_subtitulo">Terraform</p>

<div class="formulario_menu">

    <a href="../../index.html">Volver al inicio</a>

    <div class="desplegable">
        <p>EC2</p>
        <div class="desplegable_opc">
            <a href="">Instancia</a>
            <a href="">Direcciones IP elásticas</a>
            <a href="">Grupos de seguridad</a>
            <a href="">Balanceador de carga</a>
            <a href="">Grupos de autoescalado</a>
            <a href="">Creación de claves</a>
        </div>
    </div>

    <div class="desplegable">
        <p>VPC</p>
        <div class="desplegable_opc">
            <a href="">VPC</a>
            <a href="">Subredes</a>
            <a href="">Tabla de enrutamiento</a>
            <a href="">Gateway a Internet</a>
            <a href="">Gateway NAT</a>
        </div>
    </div>

    <div class="desplegable">
        <p>S3</p>
        <div class="desplegable_opc">
            <a href="">Buckets</a>
        </div>
    </div>

</div>

<div class="contenedor_formulario">
    <div class="formulario">
        <p class="formulario_nombre">Crea una instancia</p>
        <div>
            <label for="cantidad_instancias" class="nom_cant">Cantidad de instancias:</label>
            <select id="cantidad_instancias">
                <option selected>- Selecciona -</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>
        <button id="enviar_btn">Enviar</button>
    </div>

    <div class="cont_out">
        <div class="copiar_btn">
            <button id="boton-copiar"> <img src="../../img/copy_icon.png" alt="Copiar"> Copiar Código</button>
        </div>
        <div id="output">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur magnam veniam vitae neque
            facere assumenda facilis velit accusamus, odio temporibus fugiat dolorum nesciunt. Incidunt mollitia
            provident sed obcaecati vero natus?</div>
    </div>
</div>
<div id="mensaje" class="mensaje">
    ¡Código copiado!
</div>
<script src="../../script/script-terraform.js"></script>
<?php include "../../hyf/footer.php" ?>