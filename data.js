/* ============================================================
   VEXX · DATOS — bases editables (alimentos, ejercicios,
   plantillas y micronutrientes). Edita aquí para AÑADIR cosas.
   Se carga ANTES que app.js (variables globales compartidas).
   ============================================================ */
"use strict";

const CATS = ["Proteínas","Lácteos","Carbohidratos","Frutas","Verduras","Legumbres","Grasas","Suplementos"];

/* Base predefinida — alimentos comunes en México (valores por 100 g) */
const PREDEFINED = [
  // Proteínas
  {id:"p_pollo",   name:"Pechuga de pollo (cocida)", cat:"Proteínas",  cal:165, protein:31, carbs:0,    fat:3.6, fiber:0},
  {id:"p_huevo",   name:"Huevo entero",              cat:"Proteínas",  cal:143, protein:13, carbs:1.1,  fat:9.5, fiber:0, piece:50, pieceName:"pza"},
  {id:"p_resmol",  name:"Carne molida de res 90/10", cat:"Proteínas",  cal:176, protein:20, carbs:0,    fat:10,  fiber:0},
  {id:"p_bistec",  name:"Bistec de res",             cat:"Proteínas",  cal:217, protein:26, carbs:0,    fat:12,  fiber:0},
  {id:"p_atun",    name:"Atún en agua (drenado)",    cat:"Proteínas",  cal:116, protein:26, carbs:0,    fat:1,   fiber:0},
  {id:"p_salmon",  name:"Salmón",                    cat:"Proteínas",  cal:208, protein:20, carbs:0,    fat:13,  fiber:0},
  {id:"p_tilapia", name:"Tilapia",                   cat:"Proteínas",  cal:96,  protein:20, carbs:0,    fat:1.7, fiber:0},
  {id:"p_camaron", name:"Camarón",                   cat:"Proteínas",  cal:99,  protein:24, carbs:0.2,  fat:0.3, fiber:0},
  {id:"p_pavo",    name:"Pechuga de pavo",           cat:"Proteínas",  cal:135, protein:29, carbs:0,    fat:1,   fiber:0},
  {id:"p_cerdo",   name:"Lomo de cerdo",             cat:"Proteínas",  cal:143, protein:21, carbs:0,    fat:6,   fiber:0},
  // Lácteos
  {id:"l_leche",   name:"Leche entera",              cat:"Lácteos",    cal:61,  protein:3.2,carbs:4.8,  fat:3.3, fiber:0},
  {id:"l_lechede", name:"Leche descremada",          cat:"Lácteos",    cal:35,  protein:3.4,carbs:5,    fat:0.1, fiber:0},
  {id:"l_yogur",   name:"Yogur griego natural",      cat:"Lácteos",    cal:59,  protein:10, carbs:3.6,  fat:0.4, fiber:0},
  {id:"l_panela",  name:"Queso panela",              cat:"Lácteos",    cal:215, protein:18, carbs:2.6,  fat:14,  fiber:0},
  {id:"l_oaxaca",  name:"Queso Oaxaca",              cat:"Lácteos",    cal:290, protein:19, carbs:3,    fat:22,  fiber:0},
  {id:"l_reques",  name:"Requesón",                  cat:"Lácteos",    cal:98,  protein:11, carbs:3.4,  fat:4.3, fiber:0},
  // Carbohidratos
  {id:"c_tmaiz",   name:"Tortilla de maíz",          cat:"Carbohidratos",cal:218,protein:5.7,carbs:45,  fat:2.9, fiber:6.3, piece:30, pieceName:"pza"},
  {id:"c_arroz",   name:"Arroz blanco cocido",       cat:"Carbohidratos",cal:130,protein:2.7,carbs:28,  fat:0.3, fiber:0.4},
  {id:"c_avena",   name:"Avena",                     cat:"Carbohidratos",cal:389,protein:16.9,carbs:66, fat:6.9, fiber:10.6},
  {id:"c_panint",  name:"Pan integral",              cat:"Carbohidratos",cal:247,protein:13, carbs:41,  fat:3.4, fiber:7, piece:28, pieceName:"reb"},
  {id:"c_pasta",   name:"Pasta cocida",              cat:"Carbohidratos",cal:158,protein:5.8,carbs:31,  fat:0.9, fiber:1.8},
  {id:"c_papa",    name:"Papa cocida",               cat:"Carbohidratos",cal:87, protein:1.9,carbs:20,  fat:0.1, fiber:1.8},
  {id:"c_tharina", name:"Tortilla de harina",        cat:"Carbohidratos",cal:304,protein:8,  carbs:49,  fat:8,   fiber:2.8, piece:42, pieceName:"pza"},
  // Frutas
  {id:"f_platano", name:"Plátano",                   cat:"Frutas",     cal:89,  protein:1.1,carbs:23,   fat:0.3, fiber:2.6, piece:120, pieceName:"pza"},
  {id:"f_manzana", name:"Manzana",                   cat:"Frutas",     cal:52,  protein:0.3,carbs:14,   fat:0.2, fiber:2.4, piece:180, pieceName:"pza"},
  {id:"f_papaya",  name:"Papaya",                    cat:"Frutas",     cal:43,  protein:0.5,carbs:11,   fat:0.3, fiber:1.7},
  {id:"f_mango",   name:"Mango",                     cat:"Frutas",     cal:60,  protein:0.8,carbs:15,   fat:0.4, fiber:1.6, piece:200, pieceName:"pza"},
  {id:"f_fresa",   name:"Fresa",                     cat:"Frutas",     cal:32,  protein:0.7,carbs:7.7,  fat:0.3, fiber:2},
  {id:"f_naranja", name:"Naranja",                   cat:"Frutas",     cal:47,  protein:0.9,carbs:12,   fat:0.1, fiber:2.4, piece:130, pieceName:"pza"},
  // Verduras
  {id:"v_brocoli", name:"Brócoli",                   cat:"Verduras",   cal:34,  protein:2.8,carbs:7,    fat:0.4, fiber:2.6},
  {id:"v_nopal",   name:"Nopal",                     cat:"Verduras",   cal:16,  protein:1.3,carbs:3.3,  fat:0.1, fiber:2.2},
  {id:"v_jitomate",name:"Jitomate",                  cat:"Verduras",   cal:18,  protein:0.9,carbs:3.9,  fat:0.2, fiber:1.2},
  {id:"v_espinaca",name:"Espinaca",                  cat:"Verduras",   cal:23,  protein:2.9,carbs:3.6,  fat:0.4, fiber:2.2},
  {id:"v_zanahoria",name:"Zanahoria",                cat:"Verduras",   cal:41,  protein:0.9,carbs:10,   fat:0.2, fiber:2.8},
  {id:"v_chayote", name:"Chayote",                   cat:"Verduras",   cal:19,  protein:0.8,carbs:4.5,  fat:0.1, fiber:1.7},
  // Legumbres
  {id:"g_frijol",  name:"Frijol negro cocido",       cat:"Legumbres",  cal:132, protein:8.9,carbs:24,   fat:0.5, fiber:8.7},
  {id:"g_lenteja", name:"Lenteja cocida",            cat:"Legumbres",  cal:116, protein:9,  carbs:20,   fat:0.4, fiber:7.9},
  {id:"g_garbanzo",name:"Garbanzo cocido",           cat:"Legumbres",  cal:164, protein:8.9,carbs:27,   fat:2.6, fiber:7.6},
  // Grasas
  {id:"x_aguacate",name:"Aguacate",                  cat:"Grasas",     cal:160, protein:2,  carbs:9,    fat:15,  fiber:6.7},
  {id:"x_almendra",name:"Almendra",                  cat:"Grasas",     cal:579, protein:21, carbs:22,   fat:50,  fiber:12.5, piece:1.2, pieceName:"alm"},
  {id:"x_aceite",  name:"Aceite de oliva",           cat:"Grasas",     cal:884, protein:0,  carbs:0,    fat:100, fiber:0},
  {id:"x_cacah",   name:"Cacahuate",                 cat:"Grasas",     cal:567, protein:26, carbs:16,   fat:49,  fiber:8.5},
  {id:"x_crcacah", name:"Crema de cacahuate",        cat:"Grasas",     cal:588, protein:25, carbs:20,   fat:50,  fiber:6},
  // Suplementos
  {id:"s_whey",    name:"Proteína de suero (whey)",  cat:"Suplementos",cal:370, protein:80, carbs:8,    fat:5,   fiber:0},
  {id:"s_creatina",name:"Creatina monohidratada",    cat:"Suplementos",cal:0,   protein:0,  carbs:0,    fat:0,   fiber:0},
  // --- Alimentos de la dieta del usuario ---
  {id:"p_claras",  name:"Claras de huevo",           cat:"Proteínas",  cal:52,  protein:11, carbs:0.7,  fat:0.2, fiber:0, piece:33, pieceName:"clara"},
  {id:"p_jamon",   name:"Jamón de pavo",             cat:"Proteínas",  cal:104, protein:16, carbs:1.5,  fat:3.5, fiber:0, piece:23, pieceName:"reb"},
  {id:"l_yogurtnat",name:"Yogurt natural",           cat:"Lácteos",    cal:61,  protein:3.5,carbs:4.7,  fat:3.3, fiber:0},
  {id:"l_manchego",name:"Queso manchego",            cat:"Lácteos",    cal:350, protein:25, carbs:1.5,  fat:28,  fiber:0, piece:30, pieceName:"reb"},
  {id:"c_panblanco",name:"Pan blanco",               cat:"Carbohidratos",cal:265,protein:9,  carbs:49,   fat:3.2, fiber:2.7, piece:28, pieceName:"reb"},
  {id:"c_miel",    name:"Miel",                      cat:"Carbohidratos",cal:304,protein:0.3,carbs:82,   fat:0,   fiber:0.2, piece:21, pieceName:"cda"},
  {id:"v_mixtas",  name:"Verduras mixtas",           cat:"Verduras",   cal:35,  protein:2,  carbs:7,    fat:0.3, fiber:3},
  {id:"x_nuez",    name:"Nuez",                      cat:"Grasas",     cal:654, protein:15, carbs:14,   fat:65,  fiber:6.7, piece:5, pieceName:"nuez"},
  {id:"s_omega3",  name:"Omega 3 (aceite de pescado)",cat:"Suplementos",cal:902,protein:0, carbs:0,    fat:100, fiber:0, piece:1, pieceName:"cáps"},
  {id:"s_magnesio",name:"Magnesio",                  cat:"Suplementos",cal:0,   protein:0,  carbs:0,    fat:0,   fiber:0, piece:1, pieceName:"cáps"},
  // --- Marcas específicas de la dieta del usuario ---
  {id:"l_lechelala",name:"Leche Lala 100",          cat:"Lácteos",    cal:42,  protein:3.7,carbs:4.7,  fat:1.3, fiber:0, piece:240, pieceName:"vaso"},
  {id:"l_yoplaitgr",name:"Yogurt griego Yoplait sin azúcar",cat:"Lácteos",cal:60,protein:9, carbs:4.5, fat:0.5, fiber:0},
  {id:"c_panbimbo00",name:"Pan Bimbo Cero Cero multigrano",cat:"Carbohidratos",cal:230,protein:12,carbs:40,fat:3,fiber:6, piece:30, pieceName:"reb"},
];

/* comidas por defecto (el usuario puede personalizarlas) */
const DEFAULT_MEALS = [
  {id:"desayuno",name:"Desayuno",icon:"☕"},
  {id:"comida",name:"Comida",icon:"🍽️"},
  {id:"cena",name:"Cena",icon:"🌙"},
  {id:"snack",name:"Snack",icon:"🍎"}
];

/* ====================================================================
   ENTRENAMIENTO — datos base extraídos del Excel "Planificación Angel"
   ==================================================================== */
const EX_GROUPS = ["Pecho","Espalda","Hombro","Bíceps","Tríceps","Cuádriceps","Femoral","Glúteo","Pantorrilla","Core"];
const DEFAULT_EXERCISES = [
  {id:"e_pressbanca",     name:"Press banca plano",                          group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_pressincmaq",    name:"Press inclinado en máquina",                 group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_pressincbarra",  name:"Press inclinado con barra",                  group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_pressincmanc",   name:"Press inclinado con mancuernas",             group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_pecfly",         name:"Pec Fly",                                    group:"Pecho",      repRange:"8-12",  rir:"0-1"},
  {id:"e_flysarriba",     name:"Flys de arriba hacia abajo",                 group:"Pecho",      repRange:"10-15", rir:"0-1"},
  {id:"e_fondos",         name:"Fondos",                                     group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_pressmil",       name:"Press militar con mancuernas",               group:"Hombro",     repRange:"6-10",  rir:"0-1"},
  {id:"e_latmanc",        name:"Laterales con mancuernas",                   group:"Hombro",     repRange:"8-15",  rir:"0-1"},
  {id:"e_latpolea",       name:"Laterales en polea unilaterales",            group:"Hombro",     repRange:"8-12",  rir:"0-1"},
  {id:"e_extrice",        name:"Extensión de tríceps",                       group:"Tríceps",    repRange:"8-12",  rir:"0-1"},
  {id:"e_extuni",         name:"Extensión sobre la cabeza unilateral",       group:"Tríceps",    repRange:"10-15", rir:"0-1"},
  {id:"e_pulldownneutro", name:"Pulldown neutro cerrado",                    group:"Espalda",    repRange:"12-15", rir:"0-1"},
  {id:"e_pulldownabierto",name:"Pulldown abierto",                           group:"Espalda",    repRange:"10-15", rir:"0-1"},
  {id:"e_remobarra",      name:"Remo con barra",                             group:"Espalda",    repRange:"6-10",  rir:"1-2"},
  {id:"e_remopolea",      name:"Remo individual en polea",                   group:"Espalda",    repRange:"8-12",  rir:"0-1"},
  {id:"e_remomanc",       name:"Remo con mancuernas en banco inclinado",     group:"Espalda",    repRange:"8-10",  rir:"0-1"},
  {id:"e_remogironda",    name:"Remo gironda agarre neutro abierto",         group:"Espalda",    repRange:"8-12",  rir:"0-1"},
  {id:"e_pullover",       name:"Pullover",                                   group:"Espalda",    repRange:"7-15",  rir:"0-1"},
  {id:"e_predicador",     name:"Predicador con barra",                       group:"Bíceps",     repRange:"6-10",  rir:"0-1"},
  {id:"e_curlpolea",      name:"Curl de bíceps con barra en polea",          group:"Bíceps",     repRange:"10-15", rir:"0-1"},
  {id:"e_faceaway",       name:"Face away curl",                             group:"Bíceps",     repRange:"10-15", rir:"0-1"},
  {id:"e_curlfemac",      name:"Curl femoral acostado",                      group:"Femoral",    repRange:"8-12",  rir:"0-1"},
  {id:"e_curlfemsent",    name:"Curl femoral sentado",                       group:"Femoral",    repRange:"8-15",  rir:"0-1"},
  {id:"e_rdl",            name:"RDL",                                        group:"Femoral",    repRange:"6-8",   rir:"1-2"},
  {id:"e_pesomuerto",     name:"Peso muerto convencional",                   group:"Femoral",    repRange:"4-8",   rir:"1-2"},
  {id:"e_sentadilla",     name:"Sentadilla (Smith, Hack o péndulo)",         group:"Cuádriceps", repRange:"6-10",  rir:"1-2"},
  {id:"e_extcuad",        name:"Extensión de cuádriceps",                    group:"Cuádriceps", repRange:"6-10",  rir:"0-1"},
  {id:"e_prensa",         name:"Prensa (pies bajos y cerrados)",             group:"Cuádriceps", repRange:"8-12",  rir:"0-1"},
  {id:"e_abductor",       name:"Abductor",                                   group:"Glúteo",     repRange:"12-15", rir:"0-1"},
  {id:"e_aductor",        name:"Aductor",                                    group:"Glúteo",     repRange:"12-15", rir:"0-1"},
  {id:"e_pantprensa",     name:"Pantorrilla en prensa",                      group:"Pantorrilla",repRange:"10-15", rir:"0-1"},
  {id:"e_pantsent",       name:"Pantorrilla sentado",                        group:"Pantorrilla",repRange:"10-15", rir:"0-1"},
  {id:"e_pressmaqpecho",  name:"Press de pecho en máquina",                  group:"Pecho",      repRange:"8-12",  rir:"0-1"},
  {id:"e_pressplanomanc", name:"Press plano con mancuernas",                 group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_floorpress",     name:"Floor press con mancuernas",                 group:"Pecho",      repRange:"6-10",  rir:"0-1"},
  {id:"e_crossover",      name:"Cruce de poleas (crossover)",                group:"Pecho",      repRange:"10-15", rir:"0-1"},
  {id:"e_pressmaqhombro", name:"Press de hombro en máquina",                 group:"Hombro",     repRange:"8-12",  rir:"0-1"},
  {id:"e_landmine",       name:"Press landmine unilateral",                  group:"Hombro",     repRange:"8-12",  rir:"0-1"},
  {id:"e_arnold",         name:"Press Arnold",                               group:"Hombro",     repRange:"8-12",  rir:"0-1"},
  {id:"e_frontraise",     name:"Elevaciones frontales",                      group:"Hombro",     repRange:"10-15", rir:"0-1"},
  {id:"e_reardelt",       name:"Pájaros (deltoide posterior)",               group:"Hombro",     repRange:"12-20", rir:"0-1"},
  {id:"e_facepull",       name:"Face pull",                                  group:"Hombro",     repRange:"12-20", rir:"0-1"},
  {id:"e_jalonpecho",     name:"Jalón al pecho",                             group:"Espalda",    repRange:"8-12",  rir:"0-1"},
  {id:"e_remomaq",        name:"Remo en máquina",                            group:"Espalda",    repRange:"8-12",  rir:"0-1"},
  {id:"e_remosentado",    name:"Remo sentado en polea",                      group:"Espalda",    repRange:"8-12",  rir:"0-1"},
  {id:"e_curlmartillo",   name:"Curl martillo",                              group:"Bíceps",     repRange:"8-12",  rir:"0-1"},
  {id:"e_curlconcentrado",name:"Curl concentrado",                           group:"Bíceps",     repRange:"10-15", rir:"0-1"},
  {id:"e_pressfrances",   name:"Press francés",                              group:"Tríceps",    repRange:"8-12",  rir:"0-1"},
  {id:"e_jalontriceps",   name:"Jalón de tríceps en polea",                  group:"Tríceps",    repRange:"10-15", rir:"0-1"},
  {id:"e_zancadas",       name:"Zancadas (lunges)",                          group:"Cuádriceps", repRange:"8-12",  rir:"0-1"},
  {id:"e_bulgara",        name:"Sentadilla búlgara",                         group:"Cuádriceps", repRange:"8-12",  rir:"0-1"},
  {id:"e_hipthrust",      name:"Hip thrust",                                 group:"Glúteo",     repRange:"8-12",  rir:"0-1"},
  {id:"e_rdlmanc",        name:"Peso muerto rumano con mancuernas",          group:"Femoral",    repRange:"8-12",  rir:"0-1"},
  {id:"e_gemelopie",      name:"Gemelo de pie",                              group:"Pantorrilla",repRange:"10-15", rir:"0-1"},
  {id:"e_plancha",        name:"Plancha",                                    group:"Core",       repRange:"30-60s",rir:""},
  {id:"e_crunchpolea",    name:"Crunch en polea",                            group:"Core",       repRange:"12-20", rir:"0-1"},
  {id:"e_elevpiernas",    name:"Elevación de piernas colgado",               group:"Core",       repRange:"10-20", rir:"0-1"},
  {id:"e_abruedita",      name:"Rueda abdominal",                            group:"Core",       repRange:"8-15",  rir:"1-2"},
  // Agregados por el usuario (se conservan sus ids ce_ para no duplicar en cuentas existentes)
  {id:"ce_1782310417636", name:"Dominadas",                                  group:"Espalda",    repRange:"8-12",  rir:"0-1", muscles:{dorsal:1,biceps:0.5,espaldaAlta:0.35,deltPost:0.15}},
  {id:"ce_1782311296032", name:"Remo en polea alta unilateral",              group:"Espalda",    repRange:"10-15", rir:"0-1", muscles:{dorsal:0.7,deltPost:0.45,biceps:0.35}},
  {id:"ce_1782313044383", name:"Curl femoral individual",                    group:"Femoral",    repRange:"10-12", rir:"0-1"},
  {id:"ce_1782334604277", name:"Extensión de cuádriceps unilateral",         group:"Cuádriceps", repRange:"6-10",  rir:"0-1", muscles:{cuadriceps:1}},
];

/* Tips de técnica por ejercicio (clave + error común), en lenguaje simple */
const EX_TIPS={
  e_pressbanca:"Junta las escápulas y pies firmes; baja la barra al pecho con control. Evita rebotar la barra o despegar la cadera del banco.",
  e_pressincbarra:"Banco a 30-45°; baja la barra a la parte alta del pecho. Evita abrir demasiado los codos.",
  e_pressincmanc:"Banco a 30-45°; baja las mancuernas con control hasta sentir estiramiento. Evita chocarlas arriba.",
  e_pressincmaq:"Ajusta el asiento para que las manijas queden a la altura del pecho alto. Sube sin bloquear los codos de golpe.",
  e_pressmaqpecho:"Asiento a la altura del pecho; empuja sin despegar la espalda. Baja lento.",
  e_pressplanomanc:"Muñecas firmes; baja hasta sentir estiramiento en el pecho. Evita hundir los hombros.",
  e_floorpress:"Codos a 45°; pausa suave al tocar el piso y empuja.",
  e_pecfly:"Codos ligeramente flexionados y FIJOS; abre hasta estirar el pecho. Evita convertirlo en press.",
  e_crossover:"Cruza al frente apretando el pecho 1 seg. Tronco estable.",
  e_flysarriba:"Movimiento en arco con codos suaves; aprieta el pecho al cruzar. Sin impulso.",
  e_fondos:"Inclínate un poco al frente; baja hasta ~90° de codo. Evita encoger los hombros hacia las orejas.",
  e_pressmil:"Abdomen apretado; sube sin arquear la espalda baja. Evita chocar las mancuernas arriba.",
  e_pressmaqhombro:"Espalda pegada al respaldo; empuja sin encoger el cuello.",
  e_arnold:"Gira las palmas durante la subida, con control; no lo hagas pesado al inicio.",
  e_landmine:"Empuja en diagonal con el core firme; ideal si el hombro molesta.",
  e_latmanc:"Sube hasta la altura de los hombros con codos suaves. Evita balancearte o encoger el cuello.",
  e_latpolea:"Deja que el cable estire el hombro abajo; sube con control hasta la horizontal.",
  e_frontraise:"Sube al frente hasta los ojos, sin impulso del torso.",
  e_reardelt:"Inclínate y abre hacia los lados con codos suaves; aprieta atrás 1 seg.",
  e_facepull:"Jala hacia tu cara con los codos ALTOS y abre al final. Peso moderado siempre.",
  e_jalonpecho:"Pecho arriba; jala la barra a la clavícula llevando los codos abajo. Evita columpiarte hacia atrás.",
  e_pulldownneutro:"Agarre cerrado neutro; jala al pecho alto sintiendo el dorsal, no el bíceps.",
  e_pulldownabierto:"Agarre abierto; baja la barra al pecho con el torso casi vertical.",
  e_remobarra:"Espalda RECTA y torso ~45°; jala la barra al ombligo. Evita redondear la espalda.",
  e_remomaq:"Pecho apoyado; jala con los codos, no con las manos. Aprieta la espalda 1 seg.",
  e_remosentado:"Torso erguido; lleva los codos atrás sin balancearte.",
  e_remopolea:"Un lado a la vez; rota ligeramente al jalar y controla la vuelta.",
  e_remogironda:"Agarre neutro abierto; pecho arriba y codos atrás sin encoger hombros.",
  e_remomanc:"Pecho apoyado en el banco inclinado; jala con los codos pegados.",
  e_pullover:"Brazos casi rectos; arco amplio sintiendo estirar el dorsal. No lo conviertas en press.",
  e_predicador:"Tríceps pegado al banco; baja LENTO y extiende casi completo. Evita medias reps.",
  e_curlpolea:"Codos fijos al costado; sube sin llevar los codos al frente.",
  e_faceaway:"De espaldas a la polea, codo alto y fijo; estira completo abajo.",
  e_curlmartillo:"Agarre neutro; sube sin balancear el cuerpo.",
  e_curlconcentrado:"Codo apoyado en el muslo; aprieta arriba 1 seg y baja lento.",
  e_extrice:"Codos pegados al cuerpo; extiende completo y controla la subida.",
  e_jalontriceps:"Codos fijos al costado; solo se mueve el antebrazo.",
  e_extuni:"Codo junto a la cabeza, fijo; estira el tríceps abajo con control.",
  e_pressfrances:"Baja la barra a la frente con codos fijos; sin abrir los codos.",
  e_sentadilla:"Pies al ancho de hombros; baja hasta muslos paralelos con las rodillas hacia afuera. Evita despegar los talones.",
  e_prensa:"Baja hasta ~90° sin que la cadera se despegue del asiento. Evita bloquear las rodillas de golpe.",
  e_extcuad:"Sube con control y aprieta 1 seg arriba. Evita azotar el peso al bajar.",
  e_curlfemac:"Cadera PEGADA al banco; baja en 2-3 segundos.",
  e_curlfemsent:"Espalda pegada al respaldo; aprieta el femoral al flexionar y controla la vuelta.",
  ce_1782313044383:"Una pierna a la vez; baja lento y no dejes que el peso te gane.",
  e_rdl:"Espalda recta; empuja la cadera ATRÁS y baja la barra pegada a las piernas. Evita redondear la espalda.",
  e_pesomuerto:"Barra pegada a las espinillas; espalda RECTA y pecho arriba; empuja el piso con las piernas. Evita jalar con la espalda redondeada.",
  e_rdlmanc:"Igual que el RDL: cadera atrás, mancuernas pegadas a las piernas, espalda recta.",
  e_hipthrust:"Barbilla al pecho; sube y APRIETA el glúteo 1 seg arriba. Evita arquear la espalda baja.",
  e_zancadas:"Paso amplio; la rodilla de adelante alineada con el pie. Torso ligeramente inclinado.",
  e_bulgara:"Pie trasero elevado; baja vertical con el peso en la pierna de adelante.",
  e_abductor:"Abre con control y aguanta 1 seg; controla la vuelta (no dejes que el peso azote).",
  e_aductor:"Cierra con control; ajusta el rango a lo que tu cadera permita sin dolor.",
  e_pantprensa:"Rango COMPLETO: estira abajo 1 seg y aprieta arriba 1 seg. Evita rebotar.",
  e_pantsent:"Igual: estira abajo, aprieta arriba; el rebote no cuenta.",
  e_gemelopie:"Sube en 1 seg, baja en 2-3; estira completo abajo.",
  e_plancha:"Cuerpo en línea recta; aprieta abdomen y glúteo. Evita hundir la cadera.",
  e_crunchpolea:"ENROLLA la columna hacia abajo; no jales con los brazos.",
  e_elevpiernas:"Sin balanceo; sube con el abdomen y baja LENTO.",
  e_abruedita:"Abdomen apretado todo el tiempo; no dejes caer la zona lumbar.",
  ce_1782310417636:"Pecho al frente; sube hasta pasar la barbilla. Evita medias reps con balanceo.",
  ce_1782311296032:"Codo alto y jala hacia la cadera; controla la vuelta.",
  ce_1782334604277:"Una pierna: sube con control, aprieta 1 seg arriba y baja lento."
};
function _te(exId,sets,repRange,rir){ return {exId,sets,repRange,rir}; }
const DEFAULT_TEMPLATES = [
  {id:"t_push",   name:"Push",   exercises:[
    _te("e_pressbanca",2,"6-10","0-1"),_te("e_pressincmaq",3,"6-10","0-1"),_te("e_pecfly",3,"8-12","0-1"),
    _te("e_flysarriba",2,"10-15","0-1"),_te("e_pressmil",2,"6-10","0-1"),_te("e_latmanc",2,"8-15","0-1"),
    _te("e_extrice",2,"8-12","0-1"),_te("e_extuni",2,"10-15","0-1")]},
  {id:"t_pull",   name:"Pull",   exercises:[
    _te("e_pulldownneutro",2,"12-15","0-1"),_te("e_pulldownabierto",2,"10-15","0-1"),_te("e_remobarra",2,"6-10","1-2"),
    _te("e_remopolea",2,"8-12","0-1"),_te("e_remomanc",2,"8-10","0-1"),_te("e_pullover",2,"7-15","0-1"),
    _te("e_predicador",2,"6-10","0-1"),_te("e_faceaway",2,"10-15","0-1")]},
  {id:"t_leg",    name:"Leg",    exercises:[
    _te("e_curlfemac",3,"8-12","0-1"),_te("e_sentadilla",2,"6-10","1-2"),_te("e_extcuad",3,"6-10","0-1"),
    _te("e_curlfemsent",2,"8-15","0-1"),_te("e_prensa",3,"8-12","0-1"),_te("e_abductor",3,"12-15","0-1"),
    _te("e_aductor",3,"12-15","0-1"),_te("e_pantprensa",3,"10-15","0-1"),_te("e_pantsent",3,"10-15","0-1")]},
  {id:"t_push2",  name:"Push 2", exercises:[
    _te("e_latpolea",3,"8-12","0-1"),_te("e_pressincmanc",2,"6-10","0-1"),_te("e_pressmil",2,"6-10","0-1"),
    _te("e_fondos",3,"6-10","0-1"),_te("e_extuni",2,"8-12","0-1"),_te("e_extrice",2,"10-15","0-1"),
    _te("e_latmanc",2,"12-15","0-1")]},
  {id:"t_density",name:"Density",exercises:[
    _te("e_curlfemac",2,"8-12","0-1"),_te("e_rdl",1,"6-8","1-2"),_te("e_pulldownabierto",1,"10-15","0-1"),
    _te("e_pulldownneutro",1,"8-12","0-1"),_te("e_remogironda",1,"8-12","0-1"),_te("e_remobarra",2,"8-12","0-1"),
    _te("e_curlpolea",2,"10-15","0-1"),_te("e_pantprensa",3,"10-15","0-1"),_te("e_pantsent",3,"8-12","0-1")]},
];
const KG_PER_LB = 2.2046226218;

/* ---------- estado / persistencia ---------- */

/* azúcar (g) y sodio (mg) por 100 g para alimentos comunes (cobertura parcial, como apps reales) */
const MICROS={
  p_huevo:[1.1,142],p_jamon:[1,1000],p_pollo:[0,74],p_claras:[0.7,166],p_atun:[0,247],p_salmon:[0,59],
  p_resmol:[0,66],p_bistec:[0,55],p_tilapia:[0,52],p_camaron:[0,111],p_pavo:[0,104],p_cerdo:[0,53],
  l_leche:[4.8,43],l_lechede:[5,52],l_lechelala:[4.7,50],l_yogur:[3.6,36],l_yogurtnat:[4.7,46],l_yoplaitgr:[4,40],
  l_panela:[2.6,350],l_oaxaca:[3,600],l_manchego:[1.5,600],l_reques:[3.4,330],
  c_tmaiz:[0.8,12],c_tharina:[2,400],c_panint:[5,450],c_panblanco:[5,480],c_panbimbo00:[3,380],
  c_avena:[1,2],c_arroz:[0.1,1],c_papa:[0.8,5],c_pasta:[0.6,1],c_miel:[82,4],
  f_platano:[12,1],f_manzana:[10,1],f_naranja:[9,0],f_mango:[14,1],f_fresa:[4.9,1],f_papaya:[8,8],
  v_mixtas:[4,30],v_jitomate:[2.6,5],v_zanahoria:[4.7,69],v_brocoli:[1.7,33],v_espinaca:[0.4,79],v_nopal:[1.1,20],v_chayote:[1.7,2],
  g_frijol:[0.3,1],g_lenteja:[1.8,2],g_garbanzo:[5,7],
  x_aguacate:[0.7,7],x_almendra:[4,1],x_nuez:[2.6,2],x_cacah:[4,18],x_crcacah:[9,17],x_aceite:[0,2],
  s_whey:[8,130],s_creatina:[0,0]
};
/* micros extra por 100 g (valores de referencia USDA, alimentos comunes): [grasa sat. g, potasio mg, calcio mg, hierro mg] */
const MICROS2={
  p_pollo:[1,256,15,1], p_huevo:[3.3,138,56,1.8], p_claras:[0,163,7,0.1], p_atun:[0.2,237,11,1.3], p_salmon:[3,363,9,0.3],
  p_resmol:[6,270,18,2.2], p_bistec:[6,330,18,2.6], p_tilapia:[1,302,10,0.7], p_camaron:[0.3,259,70,0.5], p_pavo:[1,239,12,1.4], p_cerdo:[3,400,19,0.9],
  l_leche:[1.9,150,113,0], l_lechede:[0.1,156,125,0], l_lechelala:[1.9,150,120,0], l_yogur:[0.7,141,110,0.1], l_yogurtnat:[0,234,150,0.1], l_yoplaitgr:[0,180,110,0],
  c_arroz:[0.1,35,10,0.2], c_avena:[1.2,429,54,4.7], c_papa:[0,421,12,0.8], c_pasta:[0.1,44,7,0.5], c_panint:[0.6,250,160,2.5],
  f_platano:[0.1,358,5,0.3], f_manzana:[0,107,6,0.1], f_naranja:[0,181,40,0.1], f_mango:[0.1,168,11,0.2], f_fresa:[0,153,16,0.4], f_papaya:[0,182,20,0.3],
  v_espinaca:[0.1,558,99,2.7], v_brocoli:[0,316,47,0.7], v_jitomate:[0,237,10,0.3], v_zanahoria:[0,320,33,0.3], v_nopal:[0,257,164,1.6],
  g_frijol:[0.1,355,35,2.1], g_lenteja:[0,369,19,3.3], g_garbanzo:[0.7,291,49,2.9],
  x_aguacate:[2.1,485,12,0.6], x_almendra:[3.8,733,269,3.7], x_nuez:[6,441,98,2.9], x_cacah:[7,705,92,4.6], x_crcacah:[7,649,49,1.7], x_aceite:[14,0,0,0.6],
  s_whey:[1,400,500,0.5]
};
