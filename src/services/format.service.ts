export const useFormatService = () => {

    const maskPhone = (phone: string): string => {
        return phone.length === 10
            ? phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")
            : phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"); 
    };

    return {
        maskPhone,
    }
}