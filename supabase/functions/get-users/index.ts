import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// заголовки для CORS — разрешаем запросы с любого домена (*)
// без этого браузер заблокирует запрос из Angular приложения
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
};

// serve — запускает сервер который слушает входящие HTTP запросы
// каждый запрос попадает сюда как req
serve(async (req: any) => {
  // браузер перед реальным запросом отправляет OPTIONS (preflight)
  // чтобы проверить разрешён ли CORS — просто отвечаем 200 с заголовками
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // createClient с SERVICE_ROLE_KEY — это суперпользователь
  // в отличие от anon ключа он имеет доступ к auth.users и обходит RLS
  // SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY — env переменные Supabase
  // они автоматически доступны внутри Edge Functions без настройки
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // auth.admin.listUsers() — метод только для service_role
  // возвращает всех юзеров из системной таблицы auth.users
  // обычный anon клиент не имеет доступа к этому методу
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  // если что-то пошло не так — возвращаем ошибку
  if (error) {
    // new Response — стандартный Web API для HTTP ответа
    // первый аргумент — тело ответа (строка/null)
    // второй аргумент — опции: status код, заголовки
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, // Bad Request
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // берём все профили из таблицы profiles
  const { data: profiles } = await supabase.from('profiles').select('*');

  // объединяем по id — к каждому юзеру из auth добавляем его профиль
  const result = users.map((user) => ({
    ...user,
    profile: profiles?.find((p) => p.id === user.id) ?? null,
  }));

  // возвращаем список юзеров как JSON
  // JSON.stringify — превращает объект в строку для передачи по HTTP
  // status по умолчанию 200 — можно не указывать
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
