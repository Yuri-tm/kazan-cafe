
-- Site content key-value store for text blocks
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read site_content" ON public.site_content
  FOR SELECT USING (true);

-- Only authenticated users can update (we'll rely on single admin account)
CREATE POLICY "Authenticated users can update site_content" ON public.site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site_content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site_content" ON public.site_content
  FOR DELETE TO authenticated USING (true);

-- Excursions table
CREATE TABLE public.excursions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  display_name TEXT,
  price TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  details TEXT,
  category TEXT DEFAULT 'КАЗАНЬ',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.excursions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read excursions" ON public.excursions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage excursions" ON public.excursions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Special offers table
CREATE TABLE public.special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  details TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read special_offers" ON public.special_offers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage special_offers" ON public.special_offers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed site_content with current values
INSERT INTO public.site_content (key, value) VALUES
  ('site_title', 'Тур-кафе СӘЯХӘТ (путешествие)'),
  ('subtitle', 'место, где вы можете построить свой маршрут, выбирая экскурсии из нашего меню'),
  ('motivational_top', 'Постройте свой маршрут, выбирая экскурсии из нашего меню'),
  ('motivational_middle', 'Остались вопросы? Мы рады ответить на них! Позвоните нам, или закажите звонок'),
  ('motivational_bottom', 'Казань ждёт! Свяжитесь с нами и алга! (*поехали)'),
  ('phone_number', '+79600897952'),
  ('chef_name', 'Руслан Валиев'),
  ('chef_title', 'шеф-повар'),
  ('chef_description', 'Коренной казанец, чистокровный татарин, настоящий патриот своей земли; дипломированный и аккредитованный экскурсовод; член Гильдии экскурсоводов Республики Татарстан; прошёл всероссийскую аттестацию в 2023г и включён в официальный Реестр.'),
  ('chef_section_title', 'Наш повар и его команда'),
  ('offers_section_title', 'Комплимент от шеф-повара'),
  ('footer_copyright', '© Название компании'),
  ('footer_created_by', 'Created by ...'),
  ('footer_telegram_url', '#'),
  ('footer_vk_url', '#');

-- Seed excursions
INSERT INTO public.excursions (sort_order, name, display_name, price, description, details) VALUES
  (1, 'Белый камень с крестом и полумесяцем', NULL, '3900 ₽', 'Экскурсия по Казанскому кремлю с посещением внутри соборной мечети и 500-летнего храма; подаётся под соусом из исторических фактов и древних легенд.', 'Подача: пешком 2 часа\nВходной билет на объект: 190р/гость\nБлюдо рассчитано на 1-4 гостя\nДобавка: 900₽/гость'),
  (2, 'Свияжск', 'Остров сокровищ\nСвияжск', '14900 ₽', 'Это блюдо раскрывает туманно-загадочные образы древнего града Свияжска, расположенного на ''круглой горе'' и омываемого тремя реками.', 'Подача: автомобильно-пешеходная\nДлительность: 5-6 часов\nБилеты: включены\nРазмер блюда: 1-4 чел\nДобавка: 3333 руб/чел'),
  (3, 'Татарская слобода', NULL, '3900 ₽', 'Променадная прогулка по древним татарским улочкам между ажурных цветных домиков; подаётся под культурно-традиционным соусом с привкусом гастрономических татарских изысков.', 'Подача: пешком 2 часа\nВходные билеты не требуются\nБлюдо рассчитано на 1-4 гостя\nДобавка: 900₽/гость'),
  (4, 'Раифский монастырь', 'Мужская обитель Раифа', '9900 ₽', 'Это блюдо - современная рецептура мужского Раифского Богородицкого монастыря.', 'Подача: автомобильно-пешеходная\nДлительность: 4 часа\nРазмер блюда: 1-4 чел\nДобавка: 2.333 руб/чел'),
  (5, 'Туфелька Сююмбике', NULL, '3900 ₽', 'Блюдо про любовь, мудрость и жертвенность татарской царицы.', 'Подача: пешком 1 час, в музее 1 час\nВходной билет: 300р/чел (в Кремль), 190р/чел (в музей)\nБлюдо рассчитано на 1-4 гостя\nДобавка: 900р/гость'),
  (6, 'Болгар', 'Белая мечеть Булгара', '24900 ₽', 'Это самое древнее блюдо, которое мы готовы вам предложить на дегустацию.', 'Подача: автомобильно-пешеходная\nДлительность: 10-11 часов\nРазмер блюда: 2-4 чел\nВходные билеты: 800 руб/чел\nДобавка: 5900 руб/чел'),
  (7, 'Муха на окне', NULL, '4900 ₽', 'Мини-экскурсия по обоим берегам Казани "мухой"; подаётся со смесью юмора, вкусных фактов и ложкой дёгтя.', 'Подача: на авто 1,5-2 часа\nБилеты не требуются\nБлюдо рассчитано на 4 гостей'),
  (8, 'По следам Зиланта', NULL, '9990 ₽', 'Классический круг по исторической части Казани с акцентами на основных вехах истории и легендарных местах.', 'Подача: автомобильно-пешеходная\nДлительность: 4 часа\nВходной билет на объект 190р/гость\nРазмер блюда: на 1-4 гостя'),
  (9, 'Казань на максималках', NULL, '17990 ₽', 'Макси-блюдо по древнему городищу и современному мегаполису.', 'Подача: на авто. Длительность: 6 часов\nВходные билеты: включены\nДесерт: татарское чаепитие с выпечкой (включено)\nРазмер блюда: на 2-4 гостя'),
  (10, 'Вкусная татарская тарелка', NULL, '5990 ₽', 'Блюдо от шеф-повара, созданное для баловства рецепторов.', 'Подача: пешая\nДлительность: 2,5-3 часа\nРазмер блюда: на 1 гостя\nКоличество гостей: до 30 чел.'),
  (11, 'Вечерний наряд Сююмбике', NULL, '5990 ₽', 'Блюдо-послевкусие казанского дня; создано для неспешного наслаждения огнями вечерней иллюминации.', 'Подача: автомобильно-пешеходная\nДлительность: 2,5-3 часа\nРазмер блюда: на 1-4 гостя'),
  (12, 'Перезагрузка будущего 2к1', NULL, '19.900 ₽', 'Супер блюдо - настоящий вкус инноваций! Экскурсия по ''айтишной'' Казани.', 'Подача: автомобильно-пешеходная\nДлительность: 4 часа\nВходные билеты: включены\nРазмер блюда: 2-4 человека\nДобавка: 4900р');

-- Seed special offers
INSERT INTO public.special_offers (sort_order, title, price, description, details) VALUES
  (1, 'Күчтәнәч (гостинец)', 'Бесплатно', 'При покупке 2х блюд в нашем кафе - посещение Вселенского храма (Храма всех религий) с рассказом, внешним осмотром и фотосессией на фоне объекта - в подарок.', 'Условие: при заказе 2 экскурсий\nФормат: внешний осмотр и рассказ\nБонус: фотосессия на фоне объекта'),
  (2, 'Бүләк (подарок)', 'Бесплатно', 'При покупке от 3х блюд в нашем кафе - экскурсия внутри Вселенского храма (Храма всех религий) в подарок.', 'Условие: при заказе от 3 экскурсий\nФормат: посещение внутри объекта\nБонус: расширенный подарок от шеф-повара');
