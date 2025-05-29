<template>
	<div
		class="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4"
	>
		<div class="absolute top-4 right-4">
			<button
				@click="toggleLanguage"
				class="bg-white px-3 py-1 rounded-lg shadow-sm hover:bg-gray-50 transition text-purple-600"
			>
				{{ currentLanguage === "en" ? "中文" : "English" }}
			</button>
		</div>

		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-purple-600 mb-2">{{ t("title") }}</h1>
			<p class="text-gray-600 mb-4">{{ t("subtitle") }}</p>

			<!-- 难度选择 -->
			<div class="flex justify-center gap-4 mb-6">
				<button
					v-for="level in difficulties"
					:key="level.name"
					@click="() => changeDifficulty(level)"
					class="px-4 py-2 rounded-lg transition"
					:class="[
						currentDifficulty.name === level.name
							? 'bg-purple-600 text-white'
							: 'bg-white text-purple-600 hover:bg-purple-50',
					]"
				>
					{{ t(`difficulty.${level.name.toLowerCase()}`) }}
				</button>
			</div>

			<div class="flex justify-center gap-4 mb-4">
				<div class="bg-white p-3 rounded-lg shadow">
					<span class="font-semibold text-purple-600"
						>{{ t("stats.moves") }}:</span
					>
					<span class="ml-1">{{ moves }}</span>
				</div>
				<div class="bg-white p-3 rounded-lg shadow">
					<span class="font-semibold text-purple-600"
						>{{ t("stats.pairs") }}:</span
					>
					<span>{{ matchedCards.length / 2 }}</span
					>/<span>{{ currentDifficulty.pairs }}</span>
				</div>
			</div>
			<button
				@click="resetGame"
				class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition"
			>
				{{ t("buttons.reset") }}
			</button>
		</div>

		<div
			class="grid gap-2 sm:gap-3 w-full mx-auto px-2 sm:px-4"
			:class="[
				currentDifficulty.name === 'Easy'
					? 'grid-cols-4 sm:max-w-2xl'
					: currentDifficulty.name === 'Medium'
					? 'grid-cols-5 sm:max-w-3xl'
					: 'grid-cols-6 sm:max-w-3xl',
			]"
		>
			<div
				v-for="card in gameCards"
				:key="card.index"
				class="card"
				:class="{
					flipped: card.isFlipped,
					matched: card.isMatched,
					'w-16 h-16 sm:w-32 sm:h-32': currentDifficulty.name === 'Easy',
					'w-14 h-14 sm:w-28 sm:h-28': currentDifficulty.name === 'Medium',
					'w-12 h-12 sm:w-24 sm:h-24': currentDifficulty.name === 'Hard',
				}"
				@click="flipCard(card.index)"
			>
				<div class="card-inner">
					<div class="card-front">
						<Icon
							v-if="card.isMatched"
							:icon="card.icon"
							:class="cardSizeClass"
						/>
					</div>
					<div class="card-back">
						<Icon :icon="card.icon" :class="cardSizeClass" />
					</div>
				</div>
			</div>
		</div>

		<div
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
			:class="{ hidden: !showWinMessage }"
		>
			<div class="bg-white p-8 rounded-xl text-center max-w-sm">
				<h2 class="text-2xl font-bold text-purple-600 mb-4">
					{{ t("win.congrats") }}
				</h2>
				<p class="text-gray-600 mb-6">
					{{
						t("win.completed", {
							mode: t(`difficulty.${currentDifficulty.name.toLowerCase()}`),
							moves,
						})
					}}
				</p>
				<button
					@click="resetGame"
					class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition"
				>
					{{ t("buttons.playAgain") }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";
import messages from "@/i18n";

const { t, locale } = useI18n({
	messages,
	locale: "en",
	fallbackLocale: "en",
});

const currentLanguage = ref("en");

const toggleLanguage = () => {
	currentLanguage.value = currentLanguage.value === "en" ? "zh" : "en";
	locale.value = currentLanguage.value;
};

// 难度设置
const difficulties = [
	{
		name: "Easy",
		pairs: 8,
		icons: [
			"fluent-emoji:bear",
			"fluent-emoji:cat",
			"fluent-emoji:dog",
			"fluent-emoji:panda",
			"fluent-emoji:fox",
			"fluent-emoji:koala",
			"fluent-emoji:tiger",
			"fluent-emoji:lion",
		],
	},
	{
		name: "Medium",
		pairs: 10,
		icons: [
			"fluent-emoji:bear",
			"fluent-emoji:cat",
			"fluent-emoji:dog",
			"fluent-emoji:panda",
			"fluent-emoji:fox",
			"fluent-emoji:koala",
			"fluent-emoji:tiger",
			"fluent-emoji:lion",
			"fluent-emoji:cow",
			"fluent-emoji:pig",
		],
	},
	{
		name: "Hard",
		pairs: 12,
		icons: [
			"fluent-emoji:bear",
			"fluent-emoji:cat",
			"fluent-emoji:dog",
			"fluent-emoji:panda",
			"fluent-emoji:fox",
			"fluent-emoji:koala",
			"fluent-emoji:tiger",
			"fluent-emoji:lion",
			"fluent-emoji:cow",
			"fluent-emoji:pig",
			"fluent-emoji:frog",
			"fluent-emoji:monkey",
		],
	},
];

// 响应式状态
const currentDifficulty = ref(difficulties[0]);
const gameCards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref([]);
const moves = ref(0);
const canFlip = ref(true);
const showWinMessage = ref(false);

// 计算属性
const cardSizeClass = computed(() => ({
	"text-3xl sm:text-6xl": currentDifficulty.value.name === "Easy",
	"text-2xl sm:text-5xl": currentDifficulty.value.name === "Medium",
	"text-xl sm:text-4xl": currentDifficulty.value.name === "Hard",
}));

// 洗牌函数
const shuffle = (array) => {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
};

// 改变难度
const changeDifficulty = (difficulty) => {
	currentDifficulty.value = difficulty;
	resetGame();
};

// 初始化游戏
const initGame = () => {
	const { icons } = currentDifficulty.value;
	const cards = [...icons, ...icons];

	gameCards.value = shuffle(cards).map((icon, index) => ({
		icon,
		index,
		isFlipped: false,
		isMatched: false,
	}));

	flippedCards.value = [];
	matchedCards.value = [];
	moves.value = 0;
	canFlip.value = true;
	showWinMessage.value = false;
};

// 检查匹配
const checkForMatch = () => {
	const [card1, card2] = flippedCards.value;
	const isMatch = gameCards.value[card1].icon === gameCards.value[card2].icon;

	if (isMatch) {
		matchedCards.value.push(card1, card2);
		gameCards.value[card1].isMatched = true;
		gameCards.value[card2].isMatched = true;
		flippedCards.value = [];

		if (matchedCards.value.length === gameCards.value.length) {
			setTimeout(() => {
				showWinMessage.value = true;
			}, 500);
		}
	} else {
		canFlip.value = false;
		setTimeout(() => {
			gameCards.value[card1].isFlipped = false;
			gameCards.value[card2].isFlipped = false;
			flippedCards.value = [];
			canFlip.value = true;
		}, 1000);
	}
};

// 翻牌
const flipCard = (index) => {
	if (
		!canFlip.value ||
		flippedCards.value.length >= 2 ||
		gameCards.value[index].isFlipped ||
		matchedCards.value.includes(index)
	) {
		return;
	}

	gameCards.value[index].isFlipped = true;
	flippedCards.value.push(index);

	if (flippedCards.value.length === 2) {
		moves.value++;
		checkForMatch();
	}
};

// 重置游戏
const resetGame = () => {
	showWinMessage.value = false;
	initGame();
};

// 初始化游戏
initGame();
</script>

<style scoped>
.card {
	perspective: 1000px;
	cursor: pointer;
	transition: transform 0.3s;
}

.card:hover {
	transform: scale(1.05);
}

.card-inner {
	position: relative;
	width: 100%;
	height: 100%;
	text-align: center;
	transition: transform 0.6s;
	transform-style: preserve-3d;
}

.card.flipped .card-inner {
	transform: rotateY(180deg);
}

.card-front,
.card-back {
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-front {
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card-back {
	background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
	transform: rotateY(180deg);
}

.matched .card-front {
	background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
}

@keyframes match {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

.matched {
	animation: match 0.5s;
	opacity: 0.7;
}

.matched:hover {
	transform: none;
	cursor: default;
}

@media (max-width: 640px) {
	.card {
		margin: 0 auto;
	}

	.card-front,
	.card-back {
		padding: 0.5rem;
	}
}

@media (min-width: 640px) {
	.card-front,
	.card-back {
		border-radius: 0.75rem;
		box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.15);
	}
}
</style>
