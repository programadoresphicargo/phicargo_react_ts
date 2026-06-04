export const getBadgeClass = (tipo_registrante: string) => {
 if (tipo_registrante == 'automatico') return "primary";
 if (tipo_registrante == 'usuario') return "secondary";
 if (tipo_registrante == 'operador') return "success";
 return "secondary";
};