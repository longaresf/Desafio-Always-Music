const http = require('http');
const url = require('url');
const { Client } = require('pg');

const config = {
user: 'postgres',
host: 'localhost',
database: 'always_music',
password: 'xxxxxx',
port: 5432,
}
const client = new Client(config);

const parametros = process.argv;
const funcion = parametros[2];
const nombre = parametros[3];
const rut = parametros[4];
const curso = parametros[5];
const nivel = parametros[6];

async function consulta() {
    const res = await client.query('SELECT * FROM estudiantes');
    console.log('Cantidad de registros: ' + res.rowCount);
    console.log('Resultado: ', res.rows);
}

async function ingresar(nombre, rut, curso, nivel) {
    await client.query(`insert into estudiantes (nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', '${nivel}')`);
            console.log(`Registro de estudiante ${nombre}, exitoso`)
    }

async function actualizar (nombre, rut, curso, nivel) {
    await client.query(`UPDATE estudiantes SET nombre = '${nombre}', rut = '${rut}', curso = '${curso}', nivel = '${nivel}' WHERE nombre = '${nombre}'`);
            console.log(`Estudiante ${nombre}, fue actualizado`)
    }

    async function buscaRut (rut) {
        const res = await client.query(`SELECT rut FROM estudiantes WHERE rut = '${rut}'`);
        if(res.rowCount == 0){
            console.error(`Rut: ${rut} no existe`)
        } else {
            console.log(`Rut ${rut}, encontrado`);
        }
        }

        async function borraRut (rut) {
            const res = await client.query(`DELETE FROM estudiantes WHERE rut = '${rut}'`);
            if(res.rowCount == 0){
                console.error(`Rut: ${rut} no existe`)
            } else {
                console.info(`Eliminado registro para Rut, ${rut}`);
            }
            }

    async function operacionesBBDD (){
        client.connect();
        if (funcion == 'consulta'){
            await consulta();
        }
        else if (funcion == 'nuevo') {
            await ingresar (nombre, rut, curso, nivel);
        }
        else if (funcion == 'editar') {
            await actualizar (nombre, rut, curso, nivel);
        }
        else if (funcion == 'rut') {
            await buscaRut (rut);
        }
        else if (funcion == 'eliminar') {
            await borraRut (rut);
        }
        else {
            console.info('Operación no encontrada, se envía a consulta');
            await consulta();
        }
        client.end();
    }

    operacionesBBDD ()
