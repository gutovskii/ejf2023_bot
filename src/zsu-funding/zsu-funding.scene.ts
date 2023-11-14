import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { MainSceneContext } from 'src/common/types';
import { MAIN_SCENE } from 'src/main/main.scene';

export const ZSU_FUNDING_SCENE = 'ZSU_FUNDING_SCENE';

@Scene(ZSU_FUNDING_SCENE)
export class ZSUFundingScene {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: MainSceneContext) {
    await ctx.reply(
      'Друже, часи зараз не найкращі, треба їх виправляти та робити краще. Зроби свій вклад у майбутнє - допоможи Армії. Одне з найважливіших, що може зробити кожен українець - це допомога Збройним Силам України 🫡 Не прогавлюй такі моменти. Скористайся можливістю та задонать у банку. Відчуй, що ти зробив щось корисне та порадій цьому, піднявши настрій собі на день! ❤️ Давай, я в тебе вірю! 🙂🫶\n\n🤩 Ось банка: https://send.monobank.ua/jar/81F1uLsSf6\n💳 Картка банки: 5375411209259220\n🌟 <a href="https://zhuk.ua/planshet-realme-pad-10.4-6-128gb-wifi-gold?utm_medium=cpc&utm_source=hotline&utm_campaign=%D0%9F%D0%BB%D0%B0%D0%BD%D1%88%D0%B5%D1%82%D1%8B&utm_term=realme+Pad+6%2F128GB+Wi-Fi+Real+Gold+%286941399070554%29&utm_id=hotline_386&utm_content=191650">Товар</a>\n\nСлава Україні! 🇺🇦🇺🇦🇺🇦',
      { parse_mode: 'HTML' },
    );
    ctx.scene.enter(MAIN_SCENE);
  }
}
