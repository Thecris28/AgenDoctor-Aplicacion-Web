export const formatFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-").map(Number);
    // Si el formato es YYYY-MM-DD
    if (year && month && day) {
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };