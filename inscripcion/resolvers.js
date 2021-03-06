import { ProjectModel } from "../proyecto/proyecto.js";
import { UserModel } from "../usuario/usuario.js";
import { InscriptionModel } from "./inscripcion.js";

const resolverInscripciones = {
  Inscripcion: {
    proyecto: async (parent, args, context) => {
      return await ProjectModel.findOne({ _id: parent.proyecto });
    },
    estudiante: async (parent, args, context) => {
      return await UserModel.findOne({ _id: parent.estudiante });
    },
  },
  Query: {
    Inscripciones: async (parent, args, context) => {
      let filtro = {};
      if (context.userData) {
        if (context.userData.rol === "LIDER") {
          const projects = await ProjectModel.find({
            lider: "61a1150c351c7c00e8eb0be9",
          });
          const projectList = projects.map((p) => p._id.toString());
          filtro = {
            proyecto: {
              $in: projectList,
            },
          };
        }
      }
      const inscripciones = await InscriptionModel.find({ ...filtro });
      return inscripciones;
    },
    ProyectosInscritos: async (parent, args) => {
      const inscripciones = await InscriptionModel.find({
        estudiante: args._id,
      });
      return inscripciones;
    },
    // ProyectosInscritos: async (parent, args, context) => {
    //   let filtro = {};
    //   if (context.userData) {
    //     if (context.userData.rol === "ESTUDIANTE") {
    //       const inscripciones = await InscriptionModel.find({
    //         estudiante: userData._id,
    //       });
    //       const inscripcionesList = inscripciones.map((p) => p._id.toString());
    //       filtro = {
    //         inscripcion: {
    //           $in: inscripcionesList,
    //         },
    //       };
    //     }
    //   }
    //   const proyectosEstudiante = await ProjectModel.find({
    //     ...filtro,
    //   });
    //   return proyectosEstudiante;
    // },

    // inscripcionesNoAprobadas: async () => {
    //   const ina = await InscriptionModel.find({ estado: 'PENDIENTE' }).populate('estudiante');
    // },
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      const inscripcionCreada = await InscriptionModel.create({
        proyecto: args.proyecto,
        estudiante: args.estudiante,
      });
      return inscripcionCreada;
    },
    aprobarInscripcion: async (parent, args) => {
      const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: "ACEPTADO",
          fechaIngreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionAprobada;
    },
    rechazarInscripcion: async (parent, args) => {
      const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: "RECHAZADO",
          fechaIngreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };
