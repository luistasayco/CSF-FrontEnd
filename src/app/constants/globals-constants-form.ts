export class GlobalsConstantsForm {
    // Variables Etiquetas
    cEditar: string;
    cBuscar: string;
    cConsultar: string;
    cNuevo: string;
    cEliminar: string;
    cGrabar: string;
    cCancelar: string;
    cRegresar: string;
    cListar: string;
    cImprimir: string;
    cCaja: string;
    cGanancia: string;
    cGenerico: string;
    cSimulacion: string;
    cAgregar: string;
    cAceptar: string;
    cCheck: string;
    cPedido: string;
    cProcesar: string;
    cSalir: string;

    // Modulos
    cModuloRequerimiento: string;

    // Style
    cStyleButtonSecundario: string
    cStyleButtonSuccess: string

    // Variables de Etiquetas para la Firma Digital
    cFirmaUsuario: string;
    

    // Variables Iconos
    icoEditar: string;
    icoNuevo: string;
    icoBuscar: string;
    icoConsultar: string;
    icoGrabar: string;
    icoEliminar: string;
    icoCancelar: string;
    icoRegresar: string;
    icoPDF: string;
    icoCerrado: string;
    icoAbierto: string;
    icoVisualizar: string;
    icoFirmaUsuario: string;
    icoListar: string;
    icoImprimir: string;
    icoCaja: string;
    icoGanancia: string;
    icoGenerico: string;
    icoSimulacion: string;
    icoAgregar: string;
    icoAceptar: string;
    icoCheck: string;
    icoPedido: string;
    icoProcesar: string;
    icoPlus: string;
    icoMinus: string;
    icoSalir: string;

    // Variables titulos
    titleEliminar: string;
    subTitleEliminar: string;

    titleAnular: string;
    subTitleAnular: string;

    titleCierre: string;
    subTitleCierre: string;

    titleGrabar: string;
    subTitleGrabar: string;

    // Variables mensaje
    msgExitoSummary: string;
    msgExitoDetail: string;

    msgErrorSummary: string;

    msgCancelDetail: string;
    msgCancelSummary: string;

    msgInfoDetail: string;
    msgInfoSummary: string;

    // Variables size Page
    sizePage: number;
    sizePageModal: number;

    constructor() {
        // Etiqueta de Controles
        this.cNuevo = 'Nuevo';
        this.cCaja = 'Caja';
        this.cBuscar = 'Buscar';
        this.cConsultar = 'Consultar';
        this.cGrabar = 'Grabar';
        this.cCancelar = 'Cancelar';
        this.cEliminar = 'Eliminar';
        this.cRegresar = 'Regresar';
        this.cListar = 'Listar';
        this.cFirmaUsuario = 'Firma Paciente';
        this.cImprimir = 'Imprimir';
        this.cGanancia = 'Gna x Cia';
        this.cGenerico = 'Ver Genérico';
        this.cSimulacion = 'Simulación Venta';
        this.cAgregar = 'Agregar';
        this.cAceptar = 'Aceptar';
        this.cCheck = 'Check';
        this.cPedido = 'Pedido';
        this.cProcesar = 'Procesar';
        this.cSalir = 'Salir';


        // Módulos
        this.cModuloRequerimiento = 'Gestión Requerimiento';

        // style 
        this.cStyleButtonSecundario = 'ui-button-secondary'
        this.cStyleButtonSuccess = 'ui-button-success'

        // Iconos

        this.icoEditar = 'pi pi-pencil';
        this.icoNuevo = 'pi pi-plus';
        this.icoCaja = 'fa fa-credit-card';
        this.icoBuscar = 'pi pi-search';
        this.icoConsultar = 'fa fa-list';
        this.icoGrabar = 'pi pi-save';
        this.icoEliminar = 'pi pi-trash';
        this.icoCancelar = 'pi pi-times';
        this.icoRegresar = 'pi pi-sign-out';
        this.icoFirmaUsuario = 'fa fa-user-circle-o'
        this.icoPDF = 'fa fa-file-pdf-o';
        this.icoCerrado = 'fa fa-lock';
        this.icoAbierto = 'fa fa-unlock';
        this.icoVisualizar = 'fa fa-eye';
        this.icoListar = 'fa fa-list';
        this.icoImprimir = 'fa fa-print';
        this.icoGanancia = 'fa fa-money';
        this.icoGenerico = 'fa fa-medkit';
        this.icoSimulacion = 'fa fa-shopping-basket';
        this.icoAgregar = 'fa fa-plus';
        this.icoAceptar = 'fa fa-check';
        this.icoCheck = 'fa fa-check';
        this.icoPedido = 'fa fa-list-ul';
        this.icoProcesar = 'fa fa-cog';
        this.icoPlus = 'fa fa-plus';
        this.icoMinus = 'fa fa-minus';
        this.icoSalir = 'fa fa-power-off';

        // Titulo
        this.titleEliminar = 'Confirmación de Eliminación';
        this.subTitleEliminar = '¿Seguro de Eliminar el registro seleccionado?';

        this.titleAnular = 'Confirmación de Anulación';
        this.subTitleAnular = '¿Seguro de Anular el registro seleccionado?';

        this.titleCierre = 'Confirmación de Cierre';
        this.subTitleCierre = '¿Seguro de Cerrar el registro seleccionado?';

        this.titleGrabar = 'Confirmar registro de Vale de Venta';
        this.subTitleGrabar = '¿Seguro de grabar vale de venta?';

        // Msg Prime Ng
        this.msgExitoSummary = 'Mensaje de Éxito : ';
        this.msgExitoDetail = 'Se realizo correctamente...!!!';

        this.msgErrorSummary = 'Mensaje de Error : ';

        this.msgCancelSummary = 'Mensaje de Cancelación : ';
        this.msgCancelDetail = 'Se cancelo la accion con Éxito...!!!';

        this.msgInfoSummary = 'Mensaje de Información : ';
        this.msgInfoDetail = 'Se informo con Éxito...!!!';

        // Numero de Filas
        this.sizePage = 10;
        this.sizePageModal = 5;
    }
}