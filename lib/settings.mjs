export const topics = {
  intro: { title: 'Perkenalan', arabic: 'التَّعَارُف', opening: 'السَّلَامُ عَلَيْكُمْ! مَا اسْمُكَ؟', goal: 'Memperkenalkan nama, tempat tinggal, dan hobi.', words: 'اِسْمٌ · nama | أَسْكُنُ · saya tinggal | هِوَايَةٌ · hobi', help: 'اِسْمِي ... وَأَنَا أَسْكُنُ فِي ...' },
  school: { title: 'Di sekolah', arabic: 'فِي الْمَدْرَسَة', opening: 'مَا الْمَادَّةُ الَّتِي تُحِبُّهَا فِي الْمَدْرَسَةِ؟', goal: 'Menceritakan pelajaran dan kegiatan sekolah.', words: 'مَدْرَسَةٌ · sekolah | دَرْسٌ · pelajaran | صَدِيقٌ · teman', help: 'أُحِبُّ دَرْسَ ... لِأَنَّهُ ...' },
  family: { title: 'Keluarga', arabic: 'الْأُسْرَة', opening: 'حَدِّثْنِي عَنْ أُسْرَتِكَ. كَمْ أَخًا وَأُخْتًا لَدَيْكَ؟', goal: 'Menceritakan anggota keluarga dan kegiatannya.', words: 'أَبٌ · ayah | أُمٌّ · ibu | أَخٌ · saudara laki-laki', help: 'فِي أُسْرَتِي ... أَشْخَاصٍ.' },
  market: { title: 'Berbelanja', arabic: 'فِي السُّوق', opening: 'أَهْلًا وَسَهْلًا! مَاذَا تُرِيدُ أَنْ تَشْتَرِيَ؟', goal: 'Meminta barang dan menanyakan harga.', words: 'بِكَمْ · berapa harga | أُرِيدُ · saya ingin | سِعْرٌ · harga', help: 'أُرِيدُ أَنْ أَشْتَرِيَ ... بِكَمْ هَذَا؟' }
};
export function cleanHistory(value) {
  if (!Array.isArray(value) || value.length > 24) throw new Error('Riwayat terlalu panjang. Mulai sesi baru.');
  return value.map(m => {
    if (!m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 1800) throw new Error('Format percakapan tidak valid.');
    return {role:m.role,content:m.content};
  });
}
