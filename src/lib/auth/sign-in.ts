
import { supabase } from "@/integrations/supabase/client";
import { LoginFormValues } from "./schemas";

// تسجيل الدخول
export async function signIn({ email, password, rememberMe }: LoginFormValues) {
  try {
    // Reset any previous auth settings
    await supabase.auth.signOut();
    
    // تحديد خيارات حفظ الجلسة بناءً على حالة "تذكرني"
    const options = {
      auth: {
        persistSession: true,
        // if rememberMe is true, set localStorage, otherwise set sessionStorage
        storage: rememberMe ? localStorage : sessionStorage
      }
    };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Sign in error:", error);
      return { success: false, error: { message: error.message } };
    }

    // إذا كان المستخدم يريد تذكره، قم بتخزين ذلك في localStorage
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected sign in error:", error);
    return { 
      success: false, 
      error: { message: "حدث خطأ أثناء تسجيل الدخول" } 
    };
  }
}
